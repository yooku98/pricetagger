import { useProjectStore } from '../store/useProjectStore'
import { Dropzone } from './Dropzone'

export function ImageList() {
  const items = useProjectStore((s) => s.project.items)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const selectItem = useProjectStore((s) => s.selectItem)
  const removeItem = useProjectStore((s) => s.removeItem)
  const addImages = useProjectStore((s) => s.addImages)

  return (
    <div className="flex shrink-0 flex-col lg:h-full">
      <div className="hidden items-center justify-between px-3 py-2 lg:flex">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Images ({items.length})
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto p-2 lg:flex-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-x-visible lg:overflow-y-auto lg:p-0 lg:px-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => selectItem(item.id)}
            className={`group relative flex shrink-0 flex-col items-center gap-1 rounded-md p-1 text-left transition-colors lg:w-full lg:flex-row lg:gap-2 lg:p-1.5 ${
              item.id === selectedItemId ? 'bg-blue-600/20 ring-1 ring-blue-500' : 'hover:bg-neutral-800'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-14 w-14 shrink-0 rounded object-cover lg:h-10 lg:w-10"
            />
            <span className="max-w-14 truncate text-center text-[10px] text-neutral-300 lg:max-w-none lg:min-w-0 lg:flex-1 lg:text-left lg:text-xs">
              {item.name}
            </span>
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                removeItem(item.id)
              }}
              className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900/90 text-[10px] text-neutral-300 opacity-100 hover:bg-neutral-700 hover:text-white lg:static lg:h-auto lg:w-auto lg:rounded lg:bg-transparent lg:p-1 lg:text-xs lg:opacity-0 lg:group-hover:opacity-100"
              aria-label={`Remove ${item.name}`}
            >
              ✕
            </span>
          </button>
        ))}
        <Dropzone
          onFiles={(files) => void addImages(files)}
          className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed border-neutral-700 text-lg text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 lg:hidden"
        >
          +
        </Dropzone>
      </div>
      <div className="hidden p-2 lg:block">
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
