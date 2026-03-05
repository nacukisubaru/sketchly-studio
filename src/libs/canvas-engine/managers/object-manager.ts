import Konva from 'konva';

import EventManager from '@canvas/events/event-manager';
import serializeObject from '@canvas/utils/serialize-object';

import { BaseObject } from '../objects/base-object';
import { CanvasObjectData } from '../objects/types/object-data';

import { objectRegistry } from '../registry/object-registry';

import Layer from '../layers/layer';

type KonvaObject = Konva.Node;

export default class ObjectManager {
  private events: EventManager;

  private objects = new Map<string, BaseObject<KonvaObject>>();

  constructor(events: EventManager) {
    this.events = events;
  }

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

    this.initObjectEvents(obj);

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

  getSerializedObject(id: string): CanvasObjectData | null {
    const obj = this.objects.get(id);

    if (!obj) return null;

    return serializeObject(obj);
  }

  getAllObjects(): BaseObject<KonvaObject>[] {
    return Array.from(this.objects.values());
  }

  private initObjectEvents(obj: BaseObject<KonvaObject>) {
    const node = obj.instance;

    node.draggable(true);

    node.on('dragend', () => {
      this.events.emit('object:dragend', serializeObject(obj));
    });
  }
}
