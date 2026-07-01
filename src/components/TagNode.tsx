import { useEffect, useRef } from 'react'
import { Group, Shape, Text, Transformer } from 'react-konva'
import type Konva from 'konva'
import type { Tag } from '../types'
import { buildTagPath, computeTagBox } from '../lib/tagGeometry'

interface TagNodeProps {
  tag: Tag
  imageWidth: number
  imageHeight: number
  onChange: (updates: Partial<Tag>) => void
}

export function TagNode({ tag, imageWidth, imageHeight, onChange }: TagNodeProps) {
  const groupRef = useRef<Konva.Group>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const displayText = tag.text || 'Tap to set price'
  const box = computeTagBox({ ...tag, text: displayText }, imageWidth, imageHeight)

  useEffect(() => {
    if (trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [box.boxWidth, box.boxHeight])

  return (
    <>
      <Group
        ref={groupRef}
        x={box.left}
        y={box.top}
        scaleX={1}
        scaleY={1}
        draggable
        onDragEnd={(e) => {
          const node = e.target
          const centerX = node.x() + box.boxWidth / 2
          const centerY = node.y() + box.boxHeight / 2
          onChange({ x: (centerX / imageWidth) * 100, y: (centerY / imageHeight) * 100 })
        }}
        onTransformEnd={() => {
          const node = groupRef.current
          if (!node) return
          const scale = (node.scaleX() + node.scaleY()) / 2
          node.scaleX(1)
          node.scaleY(1)
          onChange({ fontSize: Math.max(8, Math.round(tag.fontSize * scale)) })
        }}
      >
        {tag.shape !== 'none' && (
          <Shape
            width={box.boxWidth}
            height={box.boxHeight}
            fill={tag.backgroundColor}
            opacity={tag.backgroundOpacity}
            sceneFunc={(ctx, shape) => {
              ctx.beginPath()
              buildTagPath(ctx, tag.shape, 0, 0, box.boxWidth, box.boxHeight)
              ctx.closePath()
              ctx.fillStrokeShape(shape)
            }}
          />
        )}
        <Text
          text={displayText}
          fontSize={tag.fontSize}
          fontFamily={tag.fontFamily}
          fontStyle="600"
          fill={tag.text ? tag.color : '#999999'}
          width={box.boxWidth}
          height={box.boxHeight}
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      </Group>
      <Transformer
        ref={trRef}
        rotateEnabled={false}
        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        keepRatio
        boundBoxFunc={(oldBox, newBox) => (newBox.width < 24 || newBox.height < 16 ? oldBox : newBox)}
      />
    </>
  )
}
