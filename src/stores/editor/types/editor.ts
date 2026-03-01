export interface CanvasObject {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  path?: string
  style?: Record<string, any>
}

export interface Layer {
  id: string
  name: string
  order: number
  isHidden: boolean
  isLocked: boolean
  objects: CanvasObject[]
}

export interface Canvas {
  id: number
  name: string
  width: number
  height: number
  layers: Layer[]
  createdAt: string
  updatedAt: string
}