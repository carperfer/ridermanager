import { createReducer, on } from '@ngrx/store';
import { DriverSelect } from 'src/app/interfaces/drivers';
import { setFilterByDrivers } from '../actions/filter-by-driver.actions'

export const initialState: DriverSelect = {
  value: 0,
  label: 'Todos'
};


export const _reducer = createReducer(
  initialState,
  on(setFilterByDrivers, (state, { data }) => data)
);

export function filterByDriverReducer(state: any, action: any) {
  return _reducer(state, action);
}
