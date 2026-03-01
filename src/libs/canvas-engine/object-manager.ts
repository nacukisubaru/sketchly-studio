import Konva from 'konva';

import { BaseObject } from './objects/base-object';
import { CanvasObjectData } from './objects/types/object-data';

import { objectRegistry } from './object-registry';

import { Layer } from './layers/layer';

type KonvaObject = Konva.Node;

export class ObjectManager {
  private objects = new Map<string, BaseObject<KonvaObject>>();

  addObject(layer: Layer, data: CanvasObjectData): KonvaObject | null {
    const ObjClass = objectRegistry[data.type];

    if (!ObjClass) {
      console.warn('Unknown object type:', data.type);

      return null;
    }

    const obj = ObjClass.create({ ...data, layerId: layer.id });

    layer.instance.add(obj.instance);
    layer.instance.batchDraw();

    this.objects.set(obj.id, obj);

    return obj.instance;
  }

  updateObject(id: string, data: Partial<CanvasObjectData>): KonvaObject | null {
    const obj = this.objects.get(id);

    if (!obj) return null;

    obj.update(data);
    obj.instance.getLayer()?.batchDraw();

    return obj.instance;
  }

  removeObject(id: string): boolean {
    const obj = this.objects.get(id);

    if (!obj) return false;

    obj.destroy();

    this.objects.delete(id);

    obj.instance.getLayer()?.batchDraw();

    return true;
  }

  moveObjectToLayer(id: string, targetLayer: Layer): boolean {
    const obj = this.objects.get(id);

    if (!obj) return false;

    obj.instance.moveTo(targetLayer.instance);

    obj.layerId = targetLayer.id;

    targetLayer.instance.batchDraw();

    return true;
  }

  findObject(id: string): BaseObject | null {
    return this.objects.get(id) ?? null;
  }

  getAllObjects(): BaseObject<KonvaObject>[] {
    return Array.from(this.objects.values());
  }
}
