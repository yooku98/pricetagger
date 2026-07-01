import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { Item, Project, Rotation, Tag, TagStyle, Template, WatermarkConfig } from '../types'
import { TEMPLATE_PRESETS } from '../templates/presets'
import { clearPersistedProject, loadPersistedProject, normalizeRotation, savePersistedProject } from '../lib/persistence'

function createDefaultTag(style: TagStyle): Tag {
  return {
    id: uuid(),
    type: 'price',
    text: '',
    x: 20,
    y: 82,
    rotation: 0,
    ...style,
  }
}

function createProject(): Project {
  return {
    id: uuid(),
    createdAt: Date.now(),
    items: [],
  }
}

function loadImage(file: File): Promise<{ url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`))
    img.src = url
  })
}

interface ProjectState {
  project: Project
  selectedItemId: string | null
  activeTemplateId: string | null
  watermark: WatermarkConfig
  hydrated: boolean

  hydrate: () => Promise<void>
  addImages: (files: File[]) => Promise<void>
  removeItem: (itemId: string) => void
  clearProject: () => void
  selectItem: (itemId: string) => void

  updateTag: (itemId: string, tagId: string, updates: Partial<Tag>) => void
  setPriceText: (itemId: string, text: string) => void
  rotateItem: (itemId: string, direction: 'cw' | 'ccw') => void

  applyStyleToAll: (style: TagStyle) => void
  applyStyleToOne: (itemId: string, style: TagStyle) => void
  selectTemplate: (template: Template) => void

  updateWatermark: (updates: Partial<WatermarkConfig>) => void
  toggleWatermark: (enabled: boolean) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: createProject(),
  selectedItemId: null,
  activeTemplateId: TEMPLATE_PRESETS[0].id,
  hydrated: false,
  watermark: {
    enabled: false,
    text: 'Your Brand',
    x: 85,
    y: 90,
    fontSize: 20,
    color: '#ffffff',
    backgroundColor: '#000000',
    backgroundOpacity: 0.5,
  },

  hydrate: async () => {
    const saved = await loadPersistedProject()
    if (saved && saved.items.length > 0) {
      const items: Item[] = saved.items.map((item) => ({
        ...item,
        rotation: normalizeRotation(item.rotation),
        imageUrl: URL.createObjectURL(item.imageFile),
        tags: item.tags.map((tag) => ({ ...tag, rotation: tag.rotation ?? 0 })),
      }))
      set((state) => ({
        project: { ...state.project, items },
        selectedItemId: saved.selectedItemId && items.some((i) => i.id === saved.selectedItemId)
          ? saved.selectedItemId
          : (items[0]?.id ?? null),
        watermark: saved.watermark ?? state.watermark,
        activeTemplateId: saved.activeTemplateId ?? state.activeTemplateId,
      }))
    }
    set({ hydrated: true })
  },

  addImages: async (files) => {
    const template = TEMPLATE_PRESETS.find((t) => t.id === get().activeTemplateId) ?? TEMPLATE_PRESETS[0]
    const newItems: Item[] = []
    for (const file of files) {
      try {
        const { url, width, height } = await loadImage(file)
        const item: Item = {
          id: uuid(),
          name: file.name,
          imageFile: file,
          imageUrl: url,
          imageWidth: width,
          imageHeight: height,
          rotation: 0,
          tags: [createDefaultTag(template.defaultTagStyle)],
        }
        newItems.push(item)
      } catch (err) {
        console.error(err)
      }
    }
    set((state) => {
      const items = [...state.project.items, ...newItems]
      return {
        project: { ...state.project, items },
        selectedItemId: state.selectedItemId ?? newItems[0]?.id ?? null,
      }
    })
  },

  removeItem: (itemId) => {
    set((state) => {
      const item = state.project.items.find((i) => i.id === itemId)
      if (item) URL.revokeObjectURL(item.imageUrl)
      const items = state.project.items.filter((i) => i.id !== itemId)
      const selectedItemId =
        state.selectedItemId === itemId ? (items[0]?.id ?? null) : state.selectedItemId
      return { project: { ...state.project, items }, selectedItemId }
    })
  },

  clearProject: () => {
    for (const item of get().project.items) URL.revokeObjectURL(item.imageUrl)
    set({ project: createProject(), selectedItemId: null })
    void clearPersistedProject()
  },

  selectItem: (itemId) => set({ selectedItemId: itemId }),

  updateTag: (itemId, tagId, updates) => {
    set((state) => ({
      project: {
        ...state.project,
        items: state.project.items.map((item) =>
          item.id !== itemId
            ? item
            : {
                ...item,
                tags: item.tags.map((tag) => (tag.id === tagId ? { ...tag, ...updates } : tag)),
              },
        ),
      },
    }))
  },

  setPriceText: (itemId, text) => {
    set((state) => ({
      project: {
        ...state.project,
        items: state.project.items.map((item) =>
          item.id !== itemId
            ? item
            : {
                ...item,
                tags: item.tags.map((tag) => (tag.type === 'price' ? { ...tag, text } : tag)),
              },
        ),
      },
    }))
  },

  rotateItem: (itemId, direction) => {
    set((state) => ({
      project: {
        ...state.project,
        items: state.project.items.map((item) =>
          item.id !== itemId
            ? item
            : { ...item, rotation: (((item.rotation + (direction === 'cw' ? 90 : -90)) % 360) + 360) % 360 as Rotation },
        ),
      },
    }))
  },

  applyStyleToAll: (style) => {
    set((state) => ({
      project: {
        ...state.project,
        items: state.project.items.map((item) => ({
          ...item,
          tags: item.tags.map((tag) => (tag.type === 'price' ? { ...tag, ...style } : tag)),
        })),
      },
    }))
  },

  selectTemplate: (template) => {
    set({ activeTemplateId: template.id })
    const selectedId = get().selectedItemId
    if (!selectedId) return
    get().applyStyleToOne(selectedId, template.defaultTagStyle)
  },

  updateWatermark: (updates) => set((state) => ({ watermark: { ...state.watermark, ...updates } })),
  toggleWatermark: (enabled) => set((state) => ({ watermark: { ...state.watermark, enabled } })),

  applyStyleToOne: (itemId: string, style: TagStyle) => {
    set((state) => ({
      project: {
        ...state.project,
        items: state.project.items.map((item) =>
          item.id !== itemId
            ? item
            : {
                ...item,
                tags: item.tags.map((tag) => (tag.type === 'price' ? { ...tag, ...style } : tag)),
              },
        ),
      },
    }))
  },
}))

let saveTimeout: ReturnType<typeof setTimeout> | undefined
useProjectStore.subscribe((state) => {
  if (!state.hydrated) return
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    void savePersistedProject({
      items: state.project.items.map(({ imageUrl: _imageUrl, ...rest }) => rest),
      watermark: state.watermark,
      activeTemplateId: state.activeTemplateId,
      selectedItemId: state.selectedItemId,
    })
  }, 400)
})
