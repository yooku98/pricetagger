export type TagShape = 'pill' | 'rect' | 'ribbon' | 'none'

export type TagType = 'price' | 'label' | 'watermark'

export interface Tag {
  id: string
  type: TagType
  text: string
  x: number // relative % (0-100) of image width
  y: number // relative % (0-100) of image height
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor: string
  backgroundOpacity: number // 0-1
  shape: TagShape
  rotation?: number
}

export type Rotation = 0 | 90 | 180 | 270

export interface Item {
  id: string
  name: string
  imageFile: File
  imageUrl: string
  imageWidth: number
  imageHeight: number
  rotation: Rotation
  tags: Tag[]
}

export interface TagStyle {
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor: string
  backgroundOpacity: number
  shape: TagShape
}

export interface Template {
  id: string
  name: string
  defaultTagStyle: TagStyle
  swatch: {
    bg: string
    fg: string
  }
}

export interface WatermarkConfig {
  enabled: boolean
  text: string
  x: number // relative %
  y: number // relative %
  fontSize: number
  color: string
  backgroundColor: string
  backgroundOpacity: number
}

export interface Project {
  id: string
  createdAt: number
  items: Item[]
}

export type ExportPreset = 'original' | 'instagram' | 'whatsapp'
