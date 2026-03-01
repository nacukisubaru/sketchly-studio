import { useApiStore } from '@stores/api/api';
import { create, StateCreator } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export type CanvasObject = { id: number; [key: string]: any };
export type CanvasLayer = { id: number; objects: CanvasObject[] };
export type Canvas = { 
  id: number; 
  name: string; 
  width: number; 
  height: number; 
  layers: CanvasLayer[]; 
  createdAt: string; 
  updatedAt: string 
};

export type EditorState = {
  canvas: Canvas | null;
  loadCanvas: (id: number) => Promise<void>;
  setCanvas: (canvas: Canvas) => void;
  clearCanvas: () => void;
  updateCanvas: (id: number, updatedObject: Partial<CanvasObject>) => void;
};

const editorStateCreator: StateCreator<EditorState> = (set, get) => ({
  canvas: null,

  loadCanvas: async (id: number) => {
    const api = useApiStore.getState();
    
    const data = await api.runRequest<Canvas>('get', `/canvases/${id}`);

    set({ canvas: data });
  },

  updateCanvas: (id, updatedObject) => {
    set((state) => {
      if (!state.canvas) return state;
      return {
        canvas: {
          ...state.canvas,
          layers: state.canvas.layers.map(layer => ({
            ...layer,
            objects: layer.objects.map(obj =>
              obj.id === id ? { ...obj, ...updatedObject } : obj
            ),
          })),
        },
      };
    });
  },

  setCanvas: (canvas) => set({ canvas }),
  clearCanvas: () => set({ canvas: null }),
});

export const useEditorStore = create<EditorState>()(
  devtools(subscribeWithSelector(editorStateCreator), { name: 'EditorStore' })
);