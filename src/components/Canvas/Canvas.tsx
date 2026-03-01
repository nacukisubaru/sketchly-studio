import { useEffect, useRef } from 'react';

import { CanvasEngine } from '@canvas/canvas-engine';

import { useEditorStore } from '@stores/editor/editor';
import { selectObjects } from '@stores/editor/selectors/editor';


export default function Canvas({ canvasId }: { canvasId: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<CanvasEngine | null>(null);
  const hasAddedObjectsRef = useRef(false);

  const canvasObjects = useEditorStore(selectObjects);
  const loadCanvas = useEditorStore((state) => state.loadCanvas);
  const clearCanvas = useEditorStore((state) => state.clearCanvas);

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new CanvasEngine({
      container: containerRef.current,
      width: 800,
      height: 600,
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []); 

  useEffect(() => {
    const engine = engineRef.current;

    if (!engine || !canvasObjects.length || hasAddedObjectsRef.current) return;

    canvasObjects.forEach(obj => engine.addObject(obj));

    hasAddedObjectsRef.current = true;
  }, [canvasObjects]);

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
        style={{ width: '800px', height: '600px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
