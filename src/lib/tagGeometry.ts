import type { Tag, TagShape } from '../types'

let measureCanvas: HTMLCanvasElement | null = null

function getMeasureCtx(): CanvasRenderingContext2D {
  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas context unavailable')
  return ctx
}

export function measureTagBox(text: string, fontSize: number, fontFamily: string) {
  const ctx = getMeasureCtx()
  ctx.font = `600 ${fontSize}px ${fontFamily}`
  const displayText = text || ' '
  const textWidth = ctx.measureText(displayText).width
  const paddingX = fontSize * 0.55
  const paddingY = fontSize * 0.32
  const boxWidth = textWidth + paddingX * 2
  const boxHeight = fontSize * 1.25 + paddingY * 2
  return { textWidth, paddingX, paddingY, boxWidth, boxHeight }
}

export interface TagBox {
  left: number
  top: number
  centerX: number
  centerY: number
  boxWidth: number
  boxHeight: number
}

/** Computes the tag's bounding box in the image's own pixel space (imageWidth x imageHeight), with x/y treated as the box center. */
export function computeTagBox(tag: Tag, imageWidth: number, imageHeight: number): TagBox {
  const { boxWidth, boxHeight } = measureTagBox(tag.text, tag.fontSize, tag.fontFamily)
  const centerX = (tag.x / 100) * imageWidth
  const centerY = (tag.y / 100) * imageHeight
  return {
    left: centerX - boxWidth / 2,
    top: centerY - boxHeight / 2,
    centerX,
    centerY,
    boxWidth,
    boxHeight,
  }
}

interface PathContext {
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void
  closePath(): void
}

function roundedRectPath(ctx: PathContext, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2))
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/** Traces the tag background path (no fill) onto a canvas-2D-like context, in absolute coordinates. */
export function buildTagPath(ctx: PathContext, shape: TagShape, x: number, y: number, w: number, h: number) {
  if (shape === 'pill') {
    roundedRectPath(ctx, x, y, w, h, h / 2)
  } else if (shape === 'rect') {
    roundedRectPath(ctx, x, y, w, h, Math.min(6, h / 4))
  } else if (shape === 'ribbon') {
    const notch = h / 2.4
    ctx.moveTo(x, y)
    ctx.lineTo(x + w - notch, y)
    ctx.lineTo(x + w, y + h / 2)
    ctx.lineTo(x + w - notch, y + h)
    ctx.lineTo(x, y + h)
    ctx.closePath()
  }
  // 'none' produces no path — caller should skip fill entirely
}
