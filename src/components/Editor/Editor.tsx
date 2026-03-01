import { useParams } from 'react-router-dom';

import Canvas from '@components/Canvas/Canvas';

export default function Editor() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Canvas ID не указан</div>;

  const canvasId = Number(id);

  if (isNaN(canvasId)) return <div>Некорректный Canvas ID</div>;

  return <Canvas canvasId={canvasId} />;
}
