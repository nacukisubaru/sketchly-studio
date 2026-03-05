export default function isEqualObject(a: any, b: any) {
  return (
    a.x === b.x
    && a.y === b.y
    && a.width === b.width
    && a.height === b.height
    && a.rotation === b.rotation
  );
}
