'use client'

import { useMode } from '@/app/context/mode-context'

export function InvestorPrintButton() {
  const { mode } = useMode()
  if (mode !== 'investor') return null

  return (
    <button
      type="button"
      className="kt-print-fab"
      onClick={() => window.print()}
      aria-label="Download investor summary as PDF"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Download as PDF</span>
    </button>
  )
}
