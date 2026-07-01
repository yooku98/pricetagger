import { useProjectStore } from './store/useProjectStore'
import { UploadScreen } from './components/UploadScreen'
import { ImageList } from './components/ImageList'
import { PriceList } from './components/PriceList'
import { CanvasEditor } from './components/CanvasEditor'
import { ControlsPanel } from './components/ControlsPanel'

function App() {
  const hasItems = useProjectStore((s) => s.project.items.length > 0)
  const clearProject = useProjectStore((s) => s.clearProject)

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
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
        <div className="flex min-h-0 flex-1">
          <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-800">
            <div className="min-h-0 flex-1">
              <ImageList />
            </div>
            <PriceList />
          </aside>
          <main className="flex min-w-0 flex-1">
            <CanvasEditor />
          </main>
          <aside className="w-72 shrink-0 border-l border-neutral-800">
            <ControlsPanel />
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
