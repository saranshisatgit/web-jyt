'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import React from 'react'

/**
 * StatsPanel extension for the storefront renderer. Reads pre-resolved
 * panel data from node.attrs.data (injected by the backend when serving
 * /web/website/[domain]/blogs/[blogId]) and renders a lightweight
 * visualisation without pulling in a charting library.
 */

type PanelType = 'metric' | 'list' | 'table' | 'bar' | 'line' | 'area' | 'label'

type Display = {
  label?: string
  prefix?: string
  suffix?: string
  decimals?: number
  labelField?: string
  valueField?: string
  columns?: string[]
  limit?: number
  xAxis?: string
  yAxis?: string
  title?: string
  text?: string
  [k: string]: unknown
}

type PanelData = {
  value?: number | string | null
  groups?: Array<{ key: string; keys?: Record<string, unknown>; value: number | null }>
  records?: Array<Record<string, unknown>>
  buckets?: Array<{ date: string; value: number; series?: string }>
  [k: string]: unknown
}

function formatValue(value: unknown, display: Display = {}): string {
  if (value === null || value === undefined) return '—'
  let out: string
  if (typeof value === 'number') {
    const fractionDigits = display.decimals ?? (Number.isInteger(value) ? 0 : 2)
    out = value.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  } else {
    out = String(value)
  }
  if (display.prefix) out = `${display.prefix}${out}`
  if (display.suffix) out = `${out}${display.suffix}`
  return out
}

function MetricView({ data, display }: { data: PanelData; display: Display }) {
  const field = display.valueField ?? 'value'
  const value = (data as any)[field] ?? data.value
  return (
    <div className="p-6">
      <div className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
        {formatValue(value, display)}
      </div>
      {display.label && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {display.label}
        </div>
      )}
    </div>
  )
}

function ListView({ data, display }: { data: PanelData; display: Display }) {
  const items = data.groups ?? data.records ?? []
  const labelField = display.labelField ?? 'key'
  const valueField = display.valueField ?? 'value'
  const limit = display.limit ?? 20
  if (!items.length) {
    return <div className="p-4 text-sm text-gray-500">No results</div>
  }
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.slice(0, limit).map((item: any, idx) => {
        const label = item?.keys?.[labelField] ?? item?.[labelField] ?? item?.key
        const value = item?.[valueField]
        return (
          <li key={idx} className="flex justify-between items-center px-4 py-2 text-sm">
            <span className="truncate">{label !== undefined ? String(label) : '—'}</span>
            <span className="font-medium tabular-nums">{formatValue(value, display)}</span>
          </li>
        )
      })}
    </ul>
  )
}

function TableView({ data, display }: { data: PanelData; display: Display }) {
  const rows = data.groups ?? data.records ?? []
  if (!rows.length) {
    return <div className="p-4 text-sm text-gray-500">No results</div>
  }
  const columns = display.columns ?? Object.keys(rows[0] as object)
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.slice(0, display.limit ?? 50).map((row: any, idx) => (
            <tr key={idx}>
              {columns.map((c) => {
                const v = row?.keys?.[c] ?? row?.[c]
                return (
                  <td key={c} className="px-3 py-2 truncate max-w-[200px]">
                    {typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '—')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BarView({ data, display }: { data: PanelData; display: Display }) {
  const items = data.groups ?? []
  if (!items.length) {
    return <div className="p-4 text-sm text-gray-500">No data</div>
  }
  const labelField = display.labelField ?? 'key'
  const max = items.reduce((m, i) => Math.max(m, i.value ?? 0), 0) || 1
  return (
    <div className="flex flex-col gap-2 p-4">
      {items.slice(0, display.limit ?? 20).map((item: any, idx) => {
        const label = item?.keys?.[labelField] ?? item?.[labelField] ?? item?.key
        const value = item?.value ?? 0
        const pct = Math.max(2, Math.round((value / max) * 100))
        return (
          <div key={idx} className="flex items-center gap-3 text-sm">
            <div className="w-32 truncate text-gray-600 dark:text-gray-400">
              {String(label ?? '—')}
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="w-16 text-right tabular-nums font-medium">
              {formatValue(value, display)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SparkView({
  data,
  display,
  variant,
}: {
  data: PanelData
  display: Display
  variant: 'line' | 'area'
}) {
  const buckets = data.buckets ?? []
  if (!buckets.length) {
    return <div className="p-4 text-sm text-gray-500">No data</div>
  }

  // Pivot by series if present
  const byX = new Map<string, Record<string, number>>()
  const seriesSet = new Set<string>()
  for (const b of buckets) {
    const s = b.series ?? '__all__'
    seriesSet.add(s)
    if (!byX.has(b.date)) byX.set(b.date, {})
    byX.get(b.date)![s] = b.value
  }
  const sortedKeys = Array.from(byX.keys()).sort()
  const seriesNames = Array.from(seriesSet)
  const colors = ['#6366f1', '#f97316', '#10b981', '#ef4444', '#eab308']

  const width = 600
  const height = 200
  const padding = { top: 12, right: 12, bottom: 24, left: 36 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const allValues = buckets.map((b) => b.value ?? 0)
  const min = Math.min(0, ...allValues)
  const max = Math.max(1, ...allValues)
  const xStep = sortedKeys.length > 1 ? innerW / (sortedKeys.length - 1) : innerW

  const yFor = (v: number) => padding.top + innerH - ((v - min) / (max - min || 1)) * innerH
  const xFor = (i: number) => padding.left + i * xStep

  return (
    <div className="p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* y-axis labels */}
        <text x={padding.left - 4} y={padding.top + 4} fontSize="10" textAnchor="end" fill="#6b7280">
          {formatValue(max, display)}
        </text>
        <text
          x={padding.left - 4}
          y={padding.top + innerH + 4}
          fontSize="10"
          textAnchor="end"
          fill="#6b7280"
        >
          {formatValue(min, display)}
        </text>
        {/* x-axis labels (first + last) */}
        <text x={padding.left} y={height - 6} fontSize="10" fill="#6b7280">
          {sortedKeys[0]}
        </text>
        <text x={width - padding.right} y={height - 6} fontSize="10" textAnchor="end" fill="#6b7280">
          {sortedKeys[sortedKeys.length - 1]}
        </text>
        {seriesNames.map((s, si) => {
          const color = colors[si % colors.length]
          const points = sortedKeys.map((k, i) => [xFor(i), yFor(byX.get(k)?.[s] ?? 0)] as const)
          const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
          const area = `${line} L${xFor(sortedKeys.length - 1)},${yFor(min)} L${xFor(0)},${yFor(min)} Z`
          return (
            <g key={s}>
              {variant === 'area' && <path d={area} fill={color} fillOpacity={0.18} />}
              <path d={line} fill="none" stroke={color} strokeWidth={2} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function LabelView({ display }: { display: Display }) {
  return (
    <div className="p-4">
      {display.title && (
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {display.title}
        </div>
      )}
      {display.text && (
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {display.text}
        </div>
      )}
    </div>
  )
}

export const StatsPanelNodeView: React.FC<NodeViewProps> = ({ node }) => {
  const attrs = node.attrs as {
    panelId?: string
    title?: string | null
    data?: PanelData | null
    display?: Display | null
    panelType?: PanelType | null
    _resolvedAt?: string
  }

  const type: PanelType = (attrs.panelType as PanelType) ?? 'metric'
  const display: Display = attrs.display ?? {}
  const data: PanelData | null = attrs.data ?? null

  const body = !data ? (
    <div className="p-4 text-sm text-gray-500">Panel data unavailable.</div>
  ) : type === 'label' ? (
    <LabelView display={display} />
  ) : type === 'metric' ? (
    <MetricView data={data} display={display} />
  ) : type === 'list' ? (
    <ListView data={data} display={display} />
  ) : type === 'table' ? (
    <TableView data={data} display={display} />
  ) : type === 'bar' ? (
    <BarView data={data} display={display} />
  ) : type === 'line' ? (
    <SparkView data={data} display={display} variant="line" />
  ) : type === 'area' ? (
    <SparkView data={data} display={display} variant="area" />
  ) : (
    <div className="p-4 text-sm text-gray-500">Unknown panel type: {type}</div>
  )

  return (
    <NodeViewWrapper
      as="div"
      className="stats-panel my-6 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
      data-stats-panel=""
      data-panel-id={attrs.panelId ?? undefined}
    >
      {attrs.title && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {attrs.title}
          </div>
        </div>
      )}
      {body}
    </NodeViewWrapper>
  )
}

export const StatsPanelExtension = Node.create({
  name: 'statsPanel',
  group: 'block',
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      panelId: { default: null },
      title: { default: null },
      data: { default: null, rendered: false },
      display: { default: null, rendered: false },
      panelType: { default: null },
      _resolvedAt: { default: null, rendered: false },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-stats-panel]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-stats-panel': '' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(StatsPanelNodeView)
  },
})
