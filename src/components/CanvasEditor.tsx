import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import { useProjectStore } from '../store/useProjectStore'
import { useHTMLImage } from '../lib/useHTMLImage'
import { TagNode } from './TagNode'
import { WatermarkNode } from './WatermarkNode'

export function CanvasEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const project = useProjectStore((s) => s.project)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const updateTag = useProjectStore((s) => s.updateTag)
  const watermark = useProjectStore((s) => s.watermark)
  const updateWatermark = useProjectStore((s) => s.updateWatermark)

  const item = project.items.find((i) => i.id === selectedItemId)
  const image = useHTMLImage(item?.imageUrl)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!item) {
    return (
      <div ref={containerRef} className="flex flex-1 items-center justify-center bg-neutral-900 text-sm text-neutral-400">
        Select or upload an image to start editing
      </div>
    )
  }

  const padding = 32
  const availW = Math.max(containerSize.width - padding, 50)
  const availH = Math.max(containerSize.height - padding, 50)
  const scale = Math.min(availW / item.imageWidth, availH / item.imageHeight, 1) || 1
  const displayW = item.imageWidth * scale
  const displayH = item.imageHeight * scale

  const priceTag = item.tags.find((t) => t.type === 'price')

  return (
    <div ref={containerRef} className="flex flex-1 items-center justify-center overflow-hidden bg-neutral-900">
      <div className="shadow-2xl" style={{ width: displayW, height: displayH }}>
        <Stage width={displayW} height={displayH} scaleX={scale} scaleY={scale}>
          <Layer>
            {image && <KonvaImage image={image} width={item.imageWidth} height={item.imageHeight} />}
            {priceTag && (
              <TagNode
                tag={priceTag}
                imageWidth={item.imageWidth}
                imageHeight={item.imageHeight}
                onChange={(updates) => updateTag(item.id, priceTag.id, updates)}
              />
            )}
            {watermark.enabled && (
              <WatermarkNode
                watermark={watermark}
                imageWidth={item.imageWidth}
                imageHeight={item.imageHeight}
                onChange={updateWatermark}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
