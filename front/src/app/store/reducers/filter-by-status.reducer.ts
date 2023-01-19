import { Action, createReducer, on, State } from '@ngrx/store';
import { OrderStatus } from 'src/app/interfaces/orders';
import { setFilterByStatus } from '../actions/filter-by-status.actions';

export const initialState: number[] = [];


export const _reducer = createReducer(
  initialState,
  on(setFilterByStatus, (state, { data }) => data)
);

export function filterByStatusReducer(state: any, action: any) {
  return _reducer(state, action);
}