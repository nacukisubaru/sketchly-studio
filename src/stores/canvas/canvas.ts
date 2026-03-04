import { create, StateCreator } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';

import { useApiStore } from '@stores/api/api';

import {
  Canvas, CanvasLayer, CanvasObject, CanvasObjectChangeType,
} from './types/canvas';

export type CanvasStoreState = {
  canvas: Canvas | null;
  loadCanvas: (id: number) => Promise<void>;
  addObject: (layerId: number, object: CanvasObject) => void;
  updateObject: (id: number, updatedObject: Partial<CanvasObject>) => void;
  removeObject: (id: string) => void;
  setCanvas: (canvas: Canvas) => void;
  clearCanvas: () => void;
  subscribeAllObjects: (
    callback: (obj: CanvasObject, type: CanvasObjectChangeType) => void,
  ) => () => void;
  subscribeAllLayers: (
    callback: (layer: CanvasLayer) => void,
  ) => () => void;
};

const canvasStoreCreator: StateCreator<
CanvasStoreState,
[['zustand/subscribeWithSelector', never]],
[]
> = (set, get, store) => ({
  canvas: null,

  loadCanvas: async (id: number) => {
    const api = useApiStore.getState();

    const data = await api.runRequest<Canvas>('get', `/canvases/${id}`);

    set({ canvas: data });
  },

  addObject: (layerId, object) => {
    set((state) => {
      if (!state.canvas) return state;

      return {
        canvas: {
          ...state.canvas,
          layers: state.canvas.layers.map((layer) => (layer.id === layerId
            ? { ...layer, objects: [...layer.objects, object] }
            : layer)),
        },
      };
    });
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

  removeObject: (id: string) => {
    set((state) => {
      if (!state.canvas) return state;

      return {
        canvas: {
          ...state.canvas,
          layers: state.canvas.layers.map((layer) => ({
            ...layer,
            objects: layer.objects.filter((obj) => obj.id !== id),
          })),
        },
      };
    });
  },

  setCanvas: (canvas) => set({ canvas }),
  clearCanvas: () => set({ canvas: null }),

  subscribeAllLayers: (callback: (layer: CanvasLayer) => void) => {
    const layersMap = new Map<string, CanvasLayer>();

    const initialLayers = get().canvas?.layers ?? [];
    initialLayers.forEach((layer) => {
      layersMap.set(layer.id, layer);
      callback(layer);
    });

    const unsubscribe = store.subscribe(
      (state) => state.canvas?.layers,
      (layers) => {
        if (!layers) return;

        layers.forEach((layer) => {
          if (!layersMap.has(layer.id)) {
            layersMap.set(layer.id, layer);
            callback(layer);
          }
        });
      },
    );

    return unsubscribe;
  },

  subscribeAllObjects: (callback) => {
    const objectsMap = new Map<string, CanvasObject>();

    const initialLayers = get().canvas?.layers ?? [];
    initialLayers.forEach((layer) => {
      layer.objects.forEach((obj) => {
        objectsMap.set(obj.id as string, obj);
        callback(obj, 'add');
      });
    });

    const unsubscribe = store.subscribe(
      (state) => state.canvas?.layers,
      (layers) => {
        if (!layers) return;

        const currentObjects = new Map<string, CanvasObject>();

        layers.forEach((layer) => {
          layer.objects.forEach((obj) => {
            currentObjects.set(obj.id as string, obj);
          });
        });

        currentObjects.forEach((obj, id) => {
          const prev = objectsMap.get(id);
          if (!prev) {
            objectsMap.set(id, obj);

            callback(obj, 'add');
          } else if (prev !== obj) {
            objectsMap.set(id, obj);

            callback(obj, 'update');
          }
        });

        objectsMap.forEach((obj, id) => {
          if (!currentObjects.has(id)) {
            console.log('Object removed', { id, obj });
            objectsMap.delete(id);

            callback(obj, 'remove');
          }
        });
      },
    );

    return unsubscribe;
  },
});

export const useCanvasStore = create<CanvasStoreState>()(
  devtools(subscribeWithSelector(canvasStoreCreator), { name: 'CanvasStore' }),
);
