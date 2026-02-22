import { useEffect, useRef } from 'react';

import { CanvasEngine } from 'lib/canvasEngine/CanvasEngine';

export default function Editor() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    new CanvasEngine(containerRef.current);

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
