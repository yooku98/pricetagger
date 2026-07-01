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
  const left = offsetX + box.left * imageScale
  const top = offsetY + box.top * imageScale
  const w = box.boxWidth * imageScale
  const h = box.boxHeight * imageScale
  const fontSize = tag.fontSize * imageScale

  if (tag.shape !== 'none') {
    ctx.beginPath()
    buildTagPath(ctx, tag.shape, left, top, w, h)
    ctx.globalAlpha = tag.backgroundOpacity
    ctx.fillStyle = tag.backgroundColor
    ctx.fill()
    ctx.globalAlpha = 1
  }

  ctx.font = `600 ${fontSize}px ${tag.fontFamily}`
  ctx.fillStyle = tag.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(tag.text, left + w / 2, top + h / 2)
}

export async function renderItemToCanvas(
  item: Item,
  watermark: WatermarkConfig,
  preset: ExportPreset,
): Promise<HTMLCanvasElement> {
  const img = await loadHTMLImage(item.imageUrl)
  const target = preset === 'original'
    ? { width: item.imageWidth, height: item.imageHeight }
    : PRESET_DIMENSIONS[preset]

  const canvas = document.createElement('canvas')
  canvas.width = target.width
  canvas.height = target.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas context unavailable')

  const imageScale = preset === 'original'
    ? 1
    : Math.min(target.width / item.imageWidth, target.height / item.imageHeight)
  const drawnW = item.imageWidth * imageScale
  const drawnH = item.imageHeight * imageScale
  const offsetX = (target.width - drawnW) / 2
  const offsetY = (target.height - drawnH) / 2

  if (preset !== 'original') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, target.width, target.height)
  }

  ctx.drawImage(img, offsetX, offsetY, drawnW, drawnH)

  for (const tag of item.tags) {
    drawTag(ctx, tag, item.imageWidth, item.imageHeight, imageScale, offsetX, offsetY)
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
    }
    drawTag(ctx, watermarkTag, item.imageWidth, item.imageHeight, imageScale, offsetX, offsetY)
  }

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
