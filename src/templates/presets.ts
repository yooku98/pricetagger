import type { Template } from '../types'

export const TEMPLATE_PRESETS: Template[] = [
  {
    id: 'bold-yellow-pill',
    name: 'Bold Yellow Pill',
    defaultTagStyle: {
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#1a1a1a',
      backgroundColor: '#facc15',
      backgroundOpacity: 1,
      shape: 'pill',
    },
    swatch: { bg: '#facc15', fg: '#1a1a1a' },
  },
  {
    id: 'minimal-black-ribbon',
    name: 'Minimal Black Ribbon',
    defaultTagStyle: {
      fontSize: 28,
      fontFamily: 'Helvetica',
      color: '#ffffff',
      backgroundColor: '#111111',
      backgroundOpacity: 0.9,
      shape: 'ribbon',
    },
    swatch: { bg: '#111111', fg: '#ffffff' },
  },
  {
    id: 'clean-white-rect',
    name: 'Clean White Rect',
    defaultTagStyle: {
      fontSize: 28,
      fontFamily: 'Georgia',
      color: '#111111',
      backgroundColor: '#ffffff',
      backgroundOpacity: 0.95,
      shape: 'rect',
    },
    swatch: { bg: '#ffffff', fg: '#111111' },
  },
]

export const FONT_FAMILIES = ['Arial', 'Helvetica', 'Georgia', 'Verdana', 'Courier New']
