import { useRef } from 'react';

export default function useCurrentValue(value: any) {
  const valueRef = useRef(value);

  valueRef.current = value;

  return valueRef;
}
