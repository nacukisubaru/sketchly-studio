import { useCallback, useEffect, useRef } from 'react';

import { nanoid } from 'nanoid';

import { CanvasEngine } from '@canvas/canvas-engine';

import { CanvasObject, CanvasObjectChangeType } from '@stores/canvas/types/canvas';
import { useCanvasStore } from '@stores/canvas/canvas';

import useCurrentValue from '@components/hooks';

export default function Canvas({ canvasId }: { canvasId: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canvasWidth = useCanvasStore((state) => state.canvas?.width);
  const canvasHeight = useCanvasStore((state) => state.canvas?.height);

  const currentLayerId = useCanvasStore((state) => state.canvas?.layers[0]?.id);
  const currentLayerIdRef = useCurrentValue(currentLayerId);

  const loadCanvas = useCanvasStore((state) => state.loadCanvas);
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);

  const subscribeAllObjects = useCanvasStore((state) => state.subscribeAllObjects);
  const subscribeAllLayers = useCanvasStore((state) => state.subscribeAllLayers);

  const addObject = useCanvasStore((state) => state.addObject);
  const updateObject = useCanvasStore((state) => state.updateObject);
  const removeObject = useCanvasStore((state) => state.removeObject);

  const applyObjectChange = useCallback((
    engine: CanvasEngine,
  ) => (obj: CanvasObject, type: CanvasObjectChangeType) => {
    if (!engine) return;

    switch (type) {
      case 'add':
        engine.addObject(currentLayerIdRef.current, obj);

        break;
      case 'update':
        engine.updateObject(obj.id as string, obj);

        break;
      case 'remove':
        engine.removeObject(obj.id as string);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasWidth || !canvasHeight) return undefined;

    const engine = new CanvasEngine({
      container: containerRef.current,
      width: canvasWidth,
      height: canvasHeight,
    });

    const unsubscribeLayers = subscribeAllLayers((layer) => {
      const newlayer = engine.addLayer(layer);
      console.log({ newlayer });
    });
    const unsubscribeObjects = subscribeAllObjects(applyObjectChange(engine));

    return () => {
      engine.destroy();

      unsubscribeObjects();
      unsubscribeLayers();
    };
  }, [canvasWidth, canvasHeight, applyObjectChange, subscribeAllObjects, subscribeAllLayers]);

  useEffect(() => {
    loadCanvas(canvasId);

    return () => {
      clearCanvas();
    };
  }, [canvasId, loadCanvas, clearCanvas]);

  return (
    <div>
      <h1>Editor</h1>
      <button onClick={() => updateObject('0VuJkl9kvJ', { name: 'Updated Object Rect', width: 200, height: 150 })}>Update</button>
      <button onClick={() => addObject('0DuKml9juL', {
        id: nanoid(10), type: 'rect', name: 'Addded new Object Rect', width: 500, height: 200, x: 150, y: 150,
      })}
      >
        Add
      </button>
      <button onClick={() => removeObject('0VuJkl9kvJ')}>
        Remove
      </button>
      <div
        ref={containerRef}
        style={{ width: '800px', height: '800px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
