import { useProjectStore } from '../store/useProjectStore'
import { Dropzone } from './Dropzone'

export function ImageList() {
  const items = useProjectStore((s) => s.project.items)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const selectItem = useProjectStore((s) => s.selectItem)
  const removeItem = useProjectStore((s) => s.removeItem)
  const addImages = useProjectStore((s) => s.addImages)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Images ({items.length})
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => selectItem(item.id)}
            className={`group flex w-full items-center gap-2 rounded-md p-1.5 text-left transition-colors ${
              item.id === selectedItemId ? 'bg-blue-600/20 ring-1 ring-blue-500' : 'hover:bg-neutral-800'
            }`}
          >
            <img src={item.imageUrl} alt={item.name} className="h-10 w-10 shrink-0 rounded object-cover" />
            <span className="min-w-0 flex-1 truncate text-xs text-neutral-300">{item.name}</span>
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                removeItem(item.id)
              }}
              className="shrink-0 rounded p-1 text-neutral-500 opacity-0 hover:bg-neutral-700 hover:text-neutral-200 group-hover:opacity-100"
              aria-label={`Remove ${item.name}`}
            >
              ✕
            </span>
          </button>
        ))}
      </div>
      <div className="p-2">
        <Dropzone
          onFiles={(files) => void addImages(files)}
          className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-neutral-700 py-2 text-xs text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
        >
          + Add images
        </Dropzone>
      </div>
    </div>
  )
}
