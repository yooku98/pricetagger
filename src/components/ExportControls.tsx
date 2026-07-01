import { useState } from 'react'
import JSZip from 'jszip'
import { useProjectStore } from '../store/useProjectStore'
import type { ExportPreset } from '../types'
import { baseName, canvasToBlob, downloadBlob, renderItemToCanvas } from '../lib/exportImage'

const PRESET_LABELS: Record<ExportPreset, string> = {
  original: 'Original size',
  instagram: 'Instagram Feed (1080×1080)',
  whatsapp: 'WhatsApp Status (1080×1920)',
}

export function ExportControls() {
  const items = useProjectStore((s) => s.project.items)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const watermark = useProjectStore((s) => s.watermark)
  const [preset, setPreset] = useState<ExportPreset>('original')
  const [isExporting, setIsExporting] = useState(false)

  const selectedItem = items.find((i) => i.id === selectedItemId)

  async function exportCurrent() {
    if (!selectedItem) return
    setIsExporting(true)
    try {
      const canvas = await renderItemToCanvas(selectedItem, watermark, preset)
      const blob = await canvasToBlob(canvas)
      downloadBlob(blob, `${baseName(selectedItem.name)}-${preset}.png`)
    } finally {
      setIsExporting(false)
    }
  }

  async function exportAll() {
    if (items.length === 0) return
    setIsExporting(true)
    try {
      const zip = new JSZip()
      for (const item of items) {
        const canvas = await renderItemToCanvas(item, watermark, preset)
        const blob = await canvasToBlob(canvas)
        zip.file(`${baseName(item.name)}-${preset}.png`, blob)
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      downloadBlob(zipBlob, 'tagit-export.zip')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-3 border-t border-neutral-800 pt-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Export</div>

      <div className="grid grid-cols-1 gap-1">
        {(Object.keys(PRESET_LABELS) as ExportPreset[]).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`rounded border py-1.5 text-xs ${
              preset === p
                ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
            }`}
          >
            {PRESET_LABELS[p]}
          </button>
        ))}
      </div>

      <button
        onClick={() => void exportCurrent()}
        disabled={!selectedItem || isExporting}
        className="w-full rounded-md bg-neutral-100 py-2 text-sm font-medium text-neutral-900 hover:bg-white disabled:opacity-40"
      >
        {isExporting ? 'Exporting…' : 'Export current'}
      </button>
      <button
        onClick={() => void exportAll()}
        disabled={items.length === 0 || isExporting}
        className="w-full rounded-md bg-neutral-700 py-2 text-sm font-medium text-white hover:bg-neutral-600 disabled:opacity-40"
      >
        {isExporting ? 'Exporting…' : 'Export all as ZIP'}
      </button>
    </div>
  )
}
