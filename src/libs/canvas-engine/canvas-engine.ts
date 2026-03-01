// engine/CanvasEngine.ts
import Konva from 'konva';

import { ObjectManager } from './object-manager';

import { IObjectData} from './objects/types/object-data';

export interface CanvasEngineConfig {
  container: string | HTMLDivElement;
  width: number;
  height: number;
}

export class CanvasEngine {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private objectManager: ObjectManager;

  constructor(config: CanvasEngineConfig) {
    this.stage = new Konva.Stage({
      container: config.container,
      width: config.width,
      height: config.height,
    });

    this.layer = new Konva.Layer();

    this.stage.add(this.layer);

    this.objectManager = new ObjectManager(this.layer);
  }

  addObject(data: IObjectData) {
    return this.objectManager.addObject(data);
  }

  updateObject(id: string, data: Partial<IObjectData>) {
    return this.objectManager.updateObject(id, data);
  }

  removeObject(id: string) {
    return this.objectManager.removeObject(id);
  }

  findObject(id: string) {
    return this.objectManager.findObject(id);
  }

  getAllObjects() {
    return this.objectManager.getAllObjects();
  }

  getStage() {
    return this.stage;
  }

  getLayer() {
    return this.layer;
  }

  destroy() {
    this.stage.destroy();
  }
}