import { CanvasLayerData } from "@canvas/layers/types/layer-data";
import { CanvasObjectData } from "@canvas/objects/types/object-data";

export type CanvasObject = CanvasObjectData;

export interface CanvasLayer extends CanvasLayerData {
  objects: CanvasObject[];
}

export interface Canvas {
  id: number
  name: string
  width: number
  height: number
  layers: CanvasLayer[]
  createdAt: string
  updatedAt: string
}