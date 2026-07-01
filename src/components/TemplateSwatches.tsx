import { useProjectStore } from '../store/useProjectStore'
import { TEMPLATE_PRESETS } from '../templates/presets'

export function TemplateSwatches() {
  const activeTemplateId = useProjectStore((s) => s.activeTemplateId)
  const selectTemplate = useProjectStore((s) => s.selectTemplate)

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Style presets</div>
      <div className="flex gap-2">
        {TEMPLATE_PRESETS.map((template) => (
          <button
            key={template.id}
            onClick={() => selectTemplate(template)}
            title={template.name}
            className={`flex h-12 flex-1 items-center justify-center rounded-md border text-[10px] font-medium ${
              activeTemplateId === template.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-neutral-700'
            }`}
            style={{ backgroundColor: template.swatch.bg, color: template.swatch.fg }}
          >
            {template.defaultTagStyle.shape}
          </button>
        ))}
      </div>
    </div>
  )
}
