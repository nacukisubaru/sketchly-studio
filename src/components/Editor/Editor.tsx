import { useEffect, useRef } from 'react';

import { CanvasEngine } from 'libs/canvas-engine/canvas-engine';

export default function Editor() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const canvasEngine = new CanvasEngine({
      container: containerRef.current,
      width: 800,
      height: 600,
    });

    return () => {
      console.log('Editor unmounted');
    };
  }, []);

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
