import Konva from 'konva';

import { CanvasLayerData } from './types/layer-data';

export default class Layer {
  id: string;

  order: number;

  isHidden: boolean;

  isLocked: boolean;

  instance: Konva.Layer;

  constructor(stage: Konva.Stage, data: CanvasLayerData) {
    this.id = data.id;
    this.order = data.order;
    this.isHidden = data.isHidden;
    this.isLocked = data.isLocked;

    this.instance = new Konva.Layer({
      visible: !this.isHidden,
      listening: !this.isLocked,
    });

    stage.add(this.instance);

    this.instance.zIndex(this.order);
  }

  setVisibility(hidden: boolean) {
    this.isHidden = hidden;
    this.instance.visible(!hidden);
    this.instance.getStage()?.batchDraw();
  }

  setLocked(locked: boolean) {
    this.isLocked = locked;
    this.instance.listening(!locked);
  }

  setOrder(order: number) {
    this.order = order;
    this.instance.zIndex(order);
    this.instance.getStage()?.batchDraw();
  }

  destroy() {
    this.instance.destroy();
  }
}
