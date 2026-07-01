import type { ExportPreset, Item, Tag, WatermarkConfig } from '../types'
import { buildTagPath, computeTagBox } from './tagGeometry'

const PRESET_DIMENSIONS: Record<Exclude<ExportPreset, 'original'>, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1080 },
  whatsapp: { width: 1080, height: 1920 },
}

function loadHTMLImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image for export'))
    img.src = url
  })
}

function drawTag(ctx: CanvasRenderingContext2D, tag: Tag, imageWidth: number, imageHeight: number, imageScale: number, offsetX: number, offsetY: number) {
  if (!tag.text) return
  const box = computeTagBox(tag, imageWidth, imageHeight)
  const cx = offsetX + box.centerX * imageScale
  const cy = offsetY + box.centerY * imageScale
  const w = box.boxWidth * imageScale
  const h = box.boxHeight * imageScale
  const fontSize = tag.fontSize * imageScale

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((tag.rotation * Math.PI) / 180)

  if (tag.shape !== 'none') {
    ctx.beginPath()
    buildTagPath(ctx, tag.shape, -w / 2, -h / 2, w, h)
    ctx.globalAlpha = tag.backgroundOpacity
    ctx.fillStyle = tag.backgroundColor
    ctx.fill()
    ctx.globalAlpha = 1
  }

  ctx.font = `600 ${fontSize}px ${tag.fontFamily}`
  ctx.fillStyle = tag.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(tag.text, 0, 0)

  ctx.restore()
}

export async function renderItemToCanvas(
  item: Item,
  watermark: WatermarkConfig,
  preset: ExportPreset,
): Promise<HTMLCanvasElement> {
  const img = await loadHTMLImage(item.imageUrl)
  const isSideways = item.rotation === 90 || item.rotation === 270
  const boundingWidth = isSideways ? item.imageHeight : item.imageWidth
  const boundingHeight = isSideways ? item.imageWidth : item.imageHeight

  const target = preset === 'original'
    ? { width: boundingWidth, height: boundingHeight }
    : PRESET_DIMENSIONS[preset]

  const canvas = document.createElement('canvas')
  canvas.width = target.width
  canvas.height = target.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas context unavailable')

  const imageScale = preset === 'original'
    ? 1
    : Math.min(target.width / boundingWidth, target.height / boundingHeight)
  const drawnBoundingW = boundingWidth * imageScale
  const drawnBoundingH = boundingHeight * imageScale
  const centerX = (target.width - drawnBoundingW) / 2 + drawnBoundingW / 2
  const centerY = (target.height - drawnBoundingH) / 2 + drawnBoundingH / 2

  if (preset !== 'original') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, target.width, target.height)
  }

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate((item.rotation * Math.PI) / 180)
  ctx.scale(imageScale, imageScale)
  ctx.translate(-item.imageWidth / 2, -item.imageHeight / 2)

  ctx.drawImage(img, 0, 0, item.imageWidth, item.imageHeight)

  for (const tag of item.tags) {
    drawTag(ctx, tag, item.imageWidth, item.imageHeight, 1, 0, 0)
  }

  if (watermark.enabled) {
    const watermarkTag: Tag = {
      id: 'watermark',
      type: 'watermark',
      text: watermark.text,
      x: watermark.x,
      y: watermark.y,
      fontSize: watermark.fontSize,
      fontFamily: 'Arial',
      color: watermark.color,
      backgroundColor: watermark.backgroundColor,
      backgroundOpacity: watermark.backgroundOpacity,
      shape: 'rect',
      rotation: 0,
    }
    drawTag(ctx, watermarkTag, item.imageWidth, item.imageHeight, 1, 0, 0)
  }

  ctx.restore()

  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to encode PNG'))
    }, 'image/png')
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function baseName(filename: string): string {
  return filename.replace(/\.[^.]+$/, '')
}
