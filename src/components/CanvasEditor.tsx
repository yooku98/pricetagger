import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Group, Image as KonvaImage } from 'react-konva'
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
  const rotateItem = useProjectStore((s) => s.rotateItem)

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

  const isSideways = item.rotation === 90 || item.rotation === 270
  const boundingWidth = isSideways ? item.imageHeight : item.imageWidth
  const boundingHeight = isSideways ? item.imageWidth : item.imageHeight

  const padding = 32
  const availW = Math.max(containerSize.width - padding, 50)
  const availH = Math.max(containerSize.height - padding, 50)
  const scale = Math.min(availW / boundingWidth, availH / boundingHeight, 1) || 1
  const displayW = boundingWidth * scale
  const displayH = boundingHeight * scale

  const priceTag = item.tags.find((t) => t.type === 'price')

  return (
    <div ref={containerRef} className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-900">
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        <button
          onClick={() => rotateItem(item.id, 'ccw')}
          title="Rotate left"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900/90 text-neutral-300 hover:border-neutral-500 hover:text-white lg:h-8 lg:w-8"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L4 10m0 0l5-5m-5 5h11a4 4 0 010 8h-1" />
          </svg>
        </button>
        <button
          onClick={() => rotateItem(item.id, 'cw')}
          title="Rotate right"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900/90 text-neutral-300 hover:border-neutral-500 hover:text-white lg:h-8 lg:w-8"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l5-5m0 0l-5-5m5 5H9a4 4 0 000 8h1" />
          </svg>
        </button>
      </div>
      <div className="shadow-2xl" style={{ width: displayW, height: displayH, touchAction: 'none' }}>
        <Stage width={displayW} height={displayH} scaleX={scale} scaleY={scale}>
          <Layer>
            <Group
              x={boundingWidth / 2}
              y={boundingHeight / 2}
              offsetX={item.imageWidth / 2}
              offsetY={item.imageHeight / 2}
              rotation={item.rotation}
            >
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
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
