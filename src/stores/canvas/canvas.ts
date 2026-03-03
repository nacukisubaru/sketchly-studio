import { create, StateCreator } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';

import { useApiStore } from '@stores/api/api';

import { CanvasLayer, CanvasObject } from './types/canvas';

export type Canvas = {
  id: number;
  name: string;
  width: number;
  height: number;
  layers: CanvasLayer[];
  createdAt: string;
  updatedAt: string
};

export type CanvasStoreState = {
  canvas: Canvas | null;
  loadCanvas: (id: number) => Promise<void>;
  setCanvas: (canvas: Canvas) => void;
  clearCanvas: () => void;
  updateObject: (id: number, updatedObject: Partial<CanvasObject>) => void;
};

const canvasStoreCreator: StateCreator<CanvasStoreState> = (set) => ({
  canvas: null,

  loadCanvas: async (id: number) => {
    const api = useApiStore.getState();

    const data = await api.runRequest<Canvas>('get', `/canvases/${id}`);

    set({ canvas: data });
  },

  updateObject: (id, updatedObject) => {
    set((state) => {
      if (!state.canvas) return state;
      return {
        canvas: {
          ...state.canvas,
          layers: state.canvas.layers.map((layer) => ({
            ...layer,
            objects: layer.objects.map((obj) => (obj.id === id
              ? { ...obj, ...updatedObject } : obj)),
          })),
        },
      };
    });
  },

  setCanvas: (canvas) => set({ canvas }),
  clearCanvas: () => set({ canvas: null }),
});

export const useCanvasStore = create<CanvasStoreState>()(
  devtools(subscribeWithSelector(canvasStoreCreator), { name: 'CanvasStore' }),
);
