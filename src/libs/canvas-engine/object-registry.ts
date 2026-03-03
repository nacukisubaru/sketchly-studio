import CircleObject from './objects/circle-object';
import RectObject from './objects/rect-object';

export type ObjectType = keyof typeof objectRegistry;

export const objectRegistry = {
  circle: CircleObject,
  rect: RectObject,
};
