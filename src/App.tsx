import { useState } from 'react'
import { useProjectStore } from './store/useProjectStore'
import { UploadScreen } from './components/UploadScreen'
import { ImageList } from './components/ImageList'
import { PriceList } from './components/PriceList'
import { CanvasEditor } from './components/CanvasEditor'
import { ControlsPanel } from './components/ControlsPanel'
import { MobileSheet } from './components/MobileSheet'

type MobilePanel = 'none' | 'prices' | 'style'

function App() {
  const hasItems = useProjectStore((s) => s.project.items.length > 0)
  const clearProject = useProjectStore((s) => s.clearProject)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('none')

  return (
    <div className="flex h-dvh flex-col bg-neutral-950 text-neutral-100">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-4 py-2">
        <span className="text-sm font-semibold tracking-tight">TagIt</span>
        {hasItems && (
          <button
            onClick={() => {
              if (confirm('Clear the current project? This removes all uploaded images and cannot be undone.')) {
                clearProject()
              }
            }}
            className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-400 hover:border-red-500 hover:text-red-400"
          >
            Clear project
          </button>
        )}
      </header>

      {!hasItems ? (
        <UploadScreen />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="flex shrink-0 flex-col border-b border-neutral-800 lg:h-full lg:w-64 lg:border-r lg:border-b-0">
            <ImageList />
            <div className="hidden lg:block lg:min-h-0 lg:flex-1">
              <PriceList />
            </div>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <CanvasEditor />
            <div className="flex shrink-0 gap-2 border-t border-neutral-800 p-2 lg:hidden">
              <button
                onClick={() => setMobilePanel('prices')}
                className="flex-1 rounded-md border border-neutral-700 py-2 text-sm text-neutral-200 hover:border-neutral-500"
              >
                Prices
              </button>
              <button
                onClick={() => setMobilePanel('style')}
                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Style & Export
              </button>
            </div>
          </main>

          <aside className="hidden w-72 shrink-0 border-l border-neutral-800 lg:block">
            <ControlsPanel />
          </aside>

          <MobileSheet title="Quick price entry" open={mobilePanel === 'prices'} onClose={() => setMobilePanel('none')}>
            <PriceList />
          </MobileSheet>
          <MobileSheet title="Tag style & export" open={mobilePanel === 'style'} onClose={() => setMobilePanel('none')}>
            <ControlsPanel />
          </MobileSheet>
        </div>
      )}
    </div>
  )
}

export default App
