import { ObjectType, objectRegistry } from '@canvas/registry/object-registry';
import { CanvasObjectData } from '@canvas/objects/types/object-data';

import { BaseObject } from '../objects/base-object';

export default function serializeObject(obj: BaseObject): CanvasObjectData {
  const attrs = obj.instance.getAttrs();

  let type: ObjectType | undefined;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in objectRegistry) {
    const ObjClass = objectRegistry[key as ObjectType];

    if (obj instanceof ObjClass) {
      type = key as ObjectType;

      break;
    }
  }

  if (!type) {
    console.warn(`Unknown object type for object id=${obj.id}`);

    type = 'rect';
  }

  return {
    id: obj.id,
    type,
    x: attrs.x || 0,
    y: attrs.y || 0,
    width: attrs.width || 0,
    height: attrs.height || 0,
    rotation: attrs.rotation || 0,
  };
}
