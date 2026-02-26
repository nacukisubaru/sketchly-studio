import Konva from 'konva';

import { objectRegistry } from './object-registry';

import { BaseObject } from './objects/base-object';
import { IObjectData} from './objects/types/object-data';

type KonvaObject = Konva.Node;

export class ObjectManager {
  private objects = new Map<string, BaseObject<KonvaObject>>();
  private layer: Konva.Layer;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
  }

  async addObject(data: IObjectData): Promise<KonvaObject | null> {
    if (!data.type) return null;

    const ObjClass = objectRegistry[data.type];

    if (!ObjClass) {
      console.warn('Unknown object type:', data.type);

      return null;
    }

    const obj = ObjClass.create(data);

    if (obj.instance) {
      this.layer.add(obj.instance);
      this.layer.draw();
    }

    this.objects.set(obj.id, obj);
    
    return obj.instance;
  }

  updateObject(id: string, data: Partial<IObjectData>): KonvaObject | null {
    const obj = this.objects.get(id);

    if (!obj) return null;
    
    obj.update(data);
    this.layer.draw();

    return obj.instance;
  }

  removeObject(id: string): boolean {
    const obj = this.objects.get(id);

    if (!obj) return false;

    this.objects.delete(id);
    
    obj.destroy();
    this.layer.draw();

    return true;
  }

  findObject(id: string): BaseObject | null {
    return this.objects.get(id) ?? null;
  }

  getAllObjects(): BaseObject<KonvaObject>[] {
    return Array.from(this.objects.values());
  }
}