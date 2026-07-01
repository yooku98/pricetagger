import { get, set, del } from 'idb-keyval'
import type { Item, Rotation, WatermarkConfig } from '../types'

const DB_KEY = 'tagit-project-v1'

export type PersistedItem = Omit<Item, 'imageUrl'>

export interface PersistedState {
  items: PersistedItem[]
  watermark: WatermarkConfig
  activeTemplateId: string | null
  selectedItemId: string | null
}

export async function loadPersistedProject(): Promise<PersistedState | undefined> {
  try {
    return await get<PersistedState>(DB_KEY)
  } catch (err) {
    console.error('Failed to load saved project', err)
    return undefined
  }
}

export async function savePersistedProject(state: PersistedState): Promise<void> {
  try {
    await set(DB_KEY, state)
  } catch (err) {
    console.error('Failed to save project', err)
  }
}

export async function clearPersistedProject(): Promise<void> {
  try {
    await del(DB_KEY)
  } catch (err) {
    console.error('Failed to clear saved project', err)
  }
}

export function normalizeRotation(rotation: unknown): Rotation {
  return rotation === 90 || rotation === 180 || rotation === 270 ? rotation : 0
}
