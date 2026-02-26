import Konva from 'konva';

import { BaseObject } from './base-object';

export class CircleObject extends BaseObject<Konva.Circle> {
  static create(data: Record<string, any>) {
    const radius = data.radius ?? Math.min(data.width ?? 100, data.height ?? 100) / 2;
    const inst = new Konva.Circle({
      ...data,
      radius,
      fill: data.style?.fill ?? '#999',
    });
    
    return new CircleObject(data.id as string, inst);
  }

  override update(data: Record<string, any>) {
    super.update(data);
  }
}