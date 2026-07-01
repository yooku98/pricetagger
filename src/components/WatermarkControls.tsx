import { useProjectStore } from '../store/useProjectStore'

export function WatermarkControls() {
  const watermark = useProjectStore((s) => s.watermark)
  const updateWatermark = useProjectStore((s) => s.updateWatermark)
  const toggleWatermark = useProjectStore((s) => s.toggleWatermark)

  const inputClass =
    'w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:border-blue-500'

  return (
    <div className="space-y-3 border-t border-neutral-800 pt-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={watermark.enabled}
          onChange={(e) => toggleWatermark(e.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Watermark (all images)
        </span>
      </label>

      {watermark.enabled && (
        <div className="space-y-3">
          <input
            className={inputClass}
            value={watermark.text}
            onChange={(e) => updateWatermark({ text: e.target.value })}
            placeholder="Brand name"
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">Text color</span>
              <input
                type="color"
                value={watermark.color}
                onChange={(e) => updateWatermark({ color: e.target.value })}
                className="h-9 w-full cursor-pointer rounded border border-neutral-700 bg-neutral-900"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">Background</span>
              <input
                type="color"
                value={watermark.backgroundColor}
                onChange={(e) => updateWatermark({ backgroundColor: e.target.value })}
                className="h-9 w-full cursor-pointer rounded border border-neutral-700 bg-neutral-900"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-400">
              Size ({watermark.fontSize}px)
            </span>
            <input
              type="range"
              min={10}
              max={64}
              value={watermark.fontSize}
              onChange={(e) => updateWatermark({ fontSize: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <p className="text-[11px] text-neutral-500">Drag the watermark directly on the canvas to reposition it.</p>
        </div>
      )}
    </div>
  )
}
