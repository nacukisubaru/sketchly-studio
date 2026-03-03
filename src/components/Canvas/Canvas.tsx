import { useEffect, useRef } from 'react';

import { CanvasEngine } from '@canvas/canvas-engine';

import { CanvasObject } from '@stores/canvas/types/canvas';
import { useCanvasStore } from '@stores/canvas/canvas';

export default function Canvas({ canvasId }: { canvasId: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canvas = useCanvasStore((state) => state.canvas);
  const loadCanvas = useCanvasStore((state) => state.loadCanvas);
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);

  useEffect(() => {
    if (!containerRef.current || !canvas) return undefined;

    const engine = new CanvasEngine({
      container: containerRef.current,
      width: canvas.width,
      height: canvas.height,
    });

    canvas.layers.forEach((layer) => {
      const newLayer = engine.addLayer(layer);

      layer.objects.forEach((obj: CanvasObject) => engine.addObject(newLayer, {
        ...obj, layerId: layer.id,
      }));
    });

    return () => {
      engine.destroy();
    };
  }, [canvas]);

  useEffect(() => {
    loadCanvas(canvasId);

    return () => {
      clearCanvas();
    };
  }, [canvasId, loadCanvas, clearCanvas]);

  return (
    <div>
      <h1>Editor</h1>
      <div
        ref={containerRef}
        style={{ width: '800px', height: '800px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
