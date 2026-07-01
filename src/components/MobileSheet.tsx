import type { ReactNode } from 'react'

interface MobileSheetProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function MobileSheet({ title, open, onClose, children }: MobileSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-xl border-t border-neutral-800 bg-neutral-950">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-4 py-3">
          <span className="text-sm font-semibold text-neutral-100">{title}</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
