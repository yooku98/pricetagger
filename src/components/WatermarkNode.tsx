import { Group, Shape, Text } from 'react-konva'
import type Konva from 'konva'
import type { WatermarkConfig } from '../types'
import { buildTagPath, measureTagBox } from '../lib/tagGeometry'

interface WatermarkNodeProps {
  watermark: WatermarkConfig
  imageWidth: number
  imageHeight: number
  onChange: (updates: Partial<WatermarkConfig>) => void
}

export function WatermarkNode({ watermark, imageWidth, imageHeight, onChange }: WatermarkNodeProps) {
  const { boxWidth, boxHeight } = measureTagBox(watermark.text, watermark.fontSize, 'Arial')
  const centerX = (watermark.x / 100) * imageWidth
  const centerY = (watermark.y / 100) * imageHeight
  const left = centerX - boxWidth / 2
  const top = centerY - boxHeight / 2

  return (
    <Group
      x={left}
      y={top}
      draggable
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target
        const newCenterX = node.x() + boxWidth / 2
        const newCenterY = node.y() + boxHeight / 2
        onChange({ x: (newCenterX / imageWidth) * 100, y: (newCenterY / imageHeight) * 100 })
      }}
    >
      <Shape
        width={boxWidth}
        height={boxHeight}
        fill={watermark.backgroundColor}
        opacity={watermark.backgroundOpacity}
        sceneFunc={(ctx, shape) => {
          ctx.beginPath()
          buildTagPath(ctx, 'rect', 0, 0, boxWidth, boxHeight)
          ctx.closePath()
          ctx.fillStrokeShape(shape)
        }}
      />
      <Text
        text={watermark.text}
        fontSize={watermark.fontSize}
        fontFamily="Arial"
        fontStyle="600"
        fill={watermark.color}
        width={boxWidth}
        height={boxHeight}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </Group>
  )
}
