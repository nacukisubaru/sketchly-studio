import Konva from 'konva';

import { BaseObject } from './base-object';

export class RectObject extends BaseObject<Konva.Rect> {
  static create(data: Record<string, any>) {
    const inst = new Konva.Rect({
      ...data,
      fill: data.style?.fill ?? '#999',
    });

    return new RectObject(data.id as string, inst);
  }

  override update(data: Record<string, any>) {
    super.update(data);
  }
}