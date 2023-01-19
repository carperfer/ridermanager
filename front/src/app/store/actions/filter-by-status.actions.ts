import { createAction, props } from '@ngrx/store';



export enum FilterByStatusActionTypes {
  SetFilterByStatus = '[FilterByStatus] Set FilterByStatus',
}

export const setFilterByStatus = createAction(
  '[FilterByStatus] Set FilterByStatus',
  props<{ data: number[] }>()
);




