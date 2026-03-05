import Konva from 'konva';

import ObjectManager from './managers/object-manager';

import { CanvasObjectData } from './objects/types/object-data';

import { CanvasLayerData } from './layers/types/layer-data';
import Layer from './layers/layer';
import LayerManager from './managers/layer-manager';
import EventManager from './events/event-manager';

export interface CanvasEngineConfig {
  container: string | HTMLDivElement;
  width: number;
  height: number;
}

export class CanvasEngine {
  private stage: Konva.Stage;

  readonly layerManager: LayerManager;

  readonly objectManager: ObjectManager;

  readonly events: EventManager;

  constructor(config: CanvasEngineConfig) {
    this.stage = new Konva.Stage({
      container: config.container,
      width: config.width,
      height: config.height,
    });

    this.events = new EventManager();

    this.layerManager = new LayerManager(this.stage);
    this.objectManager = new ObjectManager(this.events);
  }

  addLayer(data: CanvasLayerData): Layer {
    return this.layerManager.addLayer(data);
  }

  removeLayer(layerId: string): boolean {
    return this.layerManager.removeLayer(layerId);
  }

  addObject(layerId: string, data: CanvasObjectData) {
    const layer = this.layerManager.getLayer(layerId);

    if (!layer) return null;

    return this.objectManager.addObject(layer, data);
  }

  updateObject(id: string, data: Partial<CanvasObjectData>) {
    return this.objectManager.updateObject(id, data);
  }

  moveObjectToLayer(id: string, targetLayer: Layer) {
    return this.objectManager.moveObjectToLayer(id, targetLayer);
  }

  removeObject(id: string) {
    return this.objectManager.removeObject(id);
  }

  destroy() {
    this.layerManager.clear();
    this.stage.destroy();
  }

  getStage() {
    return this.stage;
  }
}
