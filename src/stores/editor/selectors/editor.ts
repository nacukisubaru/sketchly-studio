import { createSelector } from 'reselect'

import { EditorState } from '../editor'

import { IObjectData } from '@canvas/objects/types/object-data'

export const selectLayers = createSelector(
  (state: EditorState) => state.canvas?.layers || [],
  (layers) => layers
)

export const selectObjects = createSelector(
  selectLayers,
  (layers): IObjectData[] => layers.flatMap(layer => layer.objects)
)