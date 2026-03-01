import Konva from 'konva';

export type CreateData = Record<string, any>;

export class BaseObject<T extends Konva.Node = Konva.Node> {
  id: string;

  layerId: string;

  instance: T;

  constructor(id: string, layerId: string, instance: T) {
    this.id = id;
    this.layerId = layerId;
    this.instance = instance;
  }

  update(data: CreateData) {
    this.instance.setAttrs(data);
  }

  destroy() {
    this.instance.destroy();
  }
}
