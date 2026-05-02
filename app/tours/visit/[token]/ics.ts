/**
 * Build an RFC 5545 iCalendar file for a tour visit. Pure client-side —
 * no server round-trip, no third-party deps. Customers download a single
 * VEVENT they can drop into Apple Calendar, Google, Outlook, anything.
 *
 * Spec note: line endings must be CRLF, lines >75 octets must fold,
 * commas/semicolons/backslashes inside text values must be escaped.
 */

const escapeIcsText = (s: string): string =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

const formatIcsDateUtc = (d: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
};

const foldLines = (lines: string[]): string =>
  lines
    .map((line) => {
      if (line.length <= 75) return line;
      const chunks: string[] = [];
      let i = 0;
      while (i < line.length) {
        if (i === 0) {
          chunks.push(line.slice(i, i + 75));
          i += 75;
        } else {
          chunks.push(' ' + line.slice(i, i + 74));
          i += 74;
        }
      }
      return chunks.join('\r\n');
    })
    .join('\r\n');

export type BuildIcsInput = {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  /** ISO timestamp for the tour start. */
  startsAt: string;
  /** Total duration in minutes; defaults to 4 hours if omitted. */
  durationMinutes?: number;
};

export function buildTourIcs(input: BuildIcsInput): string {
  const start = new Date(input.startsAt);
  if (isNaN(start.getTime())) throw new Error('Invalid startsAt');
  const end = new Date(start.getTime() + (input.durationMinutes ?? 240) * 60_000);
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jaal Yantra Textiles//Tour Visit//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${input.uid}`,
    `DTSTAMP:${formatIcsDateUtc(now)}`,
    `DTSTART:${formatIcsDateUtc(start)}`,
    `DTEND:${formatIcsDateUtc(end)}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
    input.description ? `DESCRIPTION:${escapeIcsText(input.description)}` : '',
    input.location ? `LOCATION:${escapeIcsText(input.location)}` : '',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean) as string[];

  return foldLines(lines) + '\r\n';
}

export function downloadIcs(filename: string, ics: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a tick so the click has time to dispatch.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
