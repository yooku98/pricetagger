import { useProjectStore } from '../store/useProjectStore'
import { FONT_FAMILIES } from '../templates/presets'
import type { TagShape } from '../types'
import { TemplateSwatches } from './TemplateSwatches'
import { WatermarkControls } from './WatermarkControls'
import { ExportControls } from './ExportControls'

const SHAPES: TagShape[] = ['pill', 'rect', 'ribbon', 'none']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  )
}

export function ControlsPanel() {
  const items = useProjectStore((s) => s.project.items)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const updateTag = useProjectStore((s) => s.updateTag)
  const setPriceText = useProjectStore((s) => s.setPriceText)
  const applyStyleToAll = useProjectStore((s) => s.applyStyleToAll)

  const item = items.find((i) => i.id === selectedItemId)
  const tag = item?.tags.find((t) => t.type === 'price')

  const inputClass =
    'w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:border-blue-500'

  if (!item || !tag) {
    return (
      <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
        <div className="p-2 text-center text-sm text-neutral-500">Select an image to edit its tag</div>
        <WatermarkControls />
        <ExportControls />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <TemplateSwatches />

      <div className="space-y-3 border-t border-neutral-800 pt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Price tag</div>

        <Field label="Price text">
          <input
            className={inputClass}
            value={tag.text}
            onChange={(e) => setPriceText(item.id, e.target.value)}
            placeholder="e.g. GHS 150"
          />
        </Field>

        <Field label="Font family">
          <select
            className={inputClass}
            value={tag.fontFamily}
            onChange={(e) => updateTag(item.id, tag.id, { fontFamily: e.target.value })}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        <Field label={`Font size (${tag.fontSize}px)`}>
          <input
            type="range"
            min={12}
            max={96}
            value={tag.fontSize}
            onChange={(e) => updateTag(item.id, tag.id, { fontSize: Number(e.target.value) })}
            className="w-full"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Text color">
            <input
              type="color"
              value={tag.color}
              onChange={(e) => updateTag(item.id, tag.id, { color: e.target.value })}
              className="h-9 w-full cursor-pointer rounded border border-neutral-700 bg-neutral-900"
            />
          </Field>
          <Field label="Background color">
            <input
              type="color"
              value={tag.backgroundColor}
              onChange={(e) => updateTag(item.id, tag.id, { backgroundColor: e.target.value })}
              className="h-9 w-full cursor-pointer rounded border border-neutral-700 bg-neutral-900"
            />
          </Field>
        </div>

        <Field label="Background shape">
          <div className="grid grid-cols-4 gap-1">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                onClick={() => updateTag(item.id, tag.id, { shape })}
                className={`rounded border py-1 text-xs capitalize ${
                  tag.shape === shape
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </Field>

        <Field label={`Background opacity (${Math.round(tag.backgroundOpacity * 100)}%)`}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={tag.backgroundOpacity}
            onChange={(e) => updateTag(item.id, tag.id, { backgroundOpacity: Number(e.target.value) })}
            className="w-full"
          />
        </Field>

        <Field label={`Rotation (${Math.round(tag.rotation)}°)`}>
          <input
            type="range"
            min={-180}
            max={180}
            value={tag.rotation}
            onChange={(e) => updateTag(item.id, tag.id, { rotation: Number(e.target.value) })}
            className="w-full"
          />
        </Field>

        <button
          onClick={() =>
            applyStyleToAll({
              fontSize: tag.fontSize,
              fontFamily: tag.fontFamily,
              color: tag.color,
              backgroundColor: tag.backgroundColor,
              backgroundOpacity: tag.backgroundOpacity,
              shape: tag.shape,
            })
          }
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Apply style to all images
        </button>
      </div>

      <WatermarkControls />
      <ExportControls />
    </div>
  )
}
