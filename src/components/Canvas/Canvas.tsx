import { useEffect, useRef } from 'react';

import { CanvasEngine } from '@canvas/canvas-engine';

import { useEditorStore } from '@stores/editor/editor';
import { CanvasObject } from '@stores/editor/types/editor';


export default function Canvas({ canvasId }: { canvasId: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canvas = useEditorStore((state) => state.canvas);
  const loadCanvas = useEditorStore((state) => state.loadCanvas);
  const clearCanvas = useEditorStore((state) => state.clearCanvas);

  useEffect(() => {
    if (!containerRef.current || !canvas) return;

    const engine = new CanvasEngine({
      container: containerRef.current,
      width: canvas?.width,
      height: canvas?.height,
    });

    canvas?.layers.forEach(layer => {
      const newLayer = engine.addLayer(layer);

      layer.objects.forEach((obj: CanvasObject) => engine.addObject(newLayer, { ...obj, layerId: layer.id }));
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
        style={{ width: `${canvas?.width}px`, height: `${canvas?.height}px`, border: '1px solid #ccc' }}
      />
    </div>
  );
}
