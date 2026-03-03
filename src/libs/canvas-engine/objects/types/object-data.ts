import { ObjectType } from '@canvas/object-registry';

export interface CanvasObjectData {
  type: ObjectType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  opacity?: number;
  rotation?: number;
  [key: string]: unknown;
}
