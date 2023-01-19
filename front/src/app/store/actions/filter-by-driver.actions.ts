import { createAction, props } from '@ngrx/store';
import { DriverSelect } from 'src/app/interfaces/drivers';


export enum FilterByDriversActionTypes {
  SetFilterByDriver = '[FilterByDriver] Set FilterByDrivers',
}

export const setFilterByDrivers = createAction(
  '[FilterByDriver] Set FilterByDrivers',
  props<{ data: DriverSelect }>()
);




