import Konva from 'konva';

import { Layer } from './layer';

import { CanvasLayerData } from './types/layer-data';

export class LayerManager {
  private layers = new Map<string, Layer>();

  private stage: Konva.Stage;

  constructor(stage: Konva.Stage) {
    this.stage = stage;
  }

  addLayer(data: CanvasLayerData): Layer {
    const layer = new Layer(this.stage, data);

    this.layers.set(data.id, layer);

    return layer;
  }

  removeLayer(layerId: string): boolean {
    const layer = this.layers.get(layerId);

    if (!layer) return false;

    layer.destroy();

    this.layers.delete(layerId);

    return true;
  }

  getLayer(layerId: string): Layer | null {
    return this.layers.get(layerId) ?? null;
  }

  setLayerVisibility(layerId: string, hidden: boolean): boolean {
    const layer = this.layers.get(layerId);

    if (!layer) return false;

    layer.setVisibility(hidden);

    return true;
  }

  setLayerLocked(layerId: string, locked: boolean): boolean {
    const layer = this.layers.get(layerId);

    if (!layer) return false;

    layer.setLocked(locked);

    return true;
  }

  reorderLayer(layerId: string, order: number): boolean {
    const layer = this.layers.get(layerId);

    if (!layer) return false;

    layer.setOrder(order);

    return true;
  }

  getAllLayers(): Layer[] {
    return Array.from(this.layers.values());
  }

  clear() {
    this.layers.forEach((layer) => layer.destroy());

    this.layers.clear();
  }
}
