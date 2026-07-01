import { useProjectStore } from '../store/useProjectStore'

export function PriceList() {
  const items = useProjectStore((s) => s.project.items)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const selectItem = useProjectStore((s) => s.selectItem)
  const setPriceText = useProjectStore((s) => s.setPriceText)

  if (items.length === 0) return null

  return (
    <div className="max-h-56 overflow-y-auto border-t border-neutral-800">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        Quick price entry
      </div>
      <table className="w-full text-xs">
        <tbody>
          {items.map((item) => {
            const priceTag = item.tags.find((t) => t.type === 'price')
            return (
              <tr
                key={item.id}
                onClick={() => selectItem(item.id)}
                className={`cursor-pointer border-t border-neutral-800/60 ${
                  item.id === selectedItemId ? 'bg-blue-600/10' : 'hover:bg-neutral-800/60'
                }`}
              >
                <td className="max-w-[7rem] truncate px-3 py-1.5 text-neutral-300">{item.name}</td>
                <td className="px-3 py-1.5">
                  <input
                    value={priceTag?.text ?? ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setPriceText(item.id, e.target.value)}
                    placeholder="e.g. GHS 150"
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-100 outline-none focus:border-blue-500"
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
