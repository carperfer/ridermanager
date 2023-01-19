import { createAction, props } from '@ngrx/store';
import { Driver } from 'src/app/interfaces/drivers';

export enum DriverActionTypes {
  LoadDrivers = '[Driver] Load Drivers',
  LoadDriversSuccess = '[Driver] Load Drivers Success',
  LoadDriversFailure = '[Driver] Load Drivers Failure',

  AddDriversFromRealtimeSuccess = '[Driver] Add Drivers From Realtime Success',
  AddDriversFromRealtimeFailure = '[Driver] Add Drivers From Realtime Failure',

  UpdateDriversFromRealtimeSuccess = '[Driver] Update Drivers From Realtime Success',
  UpdateDriversFromRealtimeFailure = '[Driver] Update Drivers From Realtime Failure',

  DeleteDrivers = '[Driver] Delete Drivers',
  DeleteDriversSuccess = '[Driver] Delete Drivers Success',
  DeleteDriversFailure = '[Driver] Delete Drivers Failure',

  DeleteDriverFromRealtimeSuccess = '[Driver] Delete Drivers From Realtime Success',
  DeleteDriverFromRealtimeFailure = '[Driver] Delete Drivers From Realtime Failure'
}

export const loadDrivers = createAction(
  DriverActionTypes.LoadDrivers,
  props<{ company_id: number }>()
);
export const loadDriversSuccess = createAction(
  DriverActionTypes.LoadDriversSuccess,
  props<{ data: Driver[] }>()
);
export const loadDriversFailure = createAction(
  DriverActionTypes.LoadDriversFailure,
  props<{ error: any }>()
);


export const addDriversFromRealtimeSuccess = createAction(
  DriverActionTypes.AddDriversFromRealtimeSuccess,
  props<{ driver: Driver }>()
);
export const addDriversFromRealtimeFailure = createAction(
  DriverActionTypes.AddDriversFromRealtimeFailure,
  props<{ error: any }>()
);


export const updateDriversFromRealtimeSuccess = createAction(
  DriverActionTypes.UpdateDriversFromRealtimeSuccess,
  props<{ updatedDriver: Driver }>()
);
export const updateDriversFromRealtimeFailure = createAction(
  DriverActionTypes.UpdateDriversFromRealtimeFailure,
  props<{ error: any }>()
);


export const deleteDrivers = createAction(
  DriverActionTypes.DeleteDrivers,
  props<{ ids: number[] }>()
);
export const deleteDriversSuccess = createAction(
  DriverActionTypes.DeleteDriversSuccess,
  props<{ ids: number[] }>()
);
export const deleteDriversFailure = createAction(
  DriverActionTypes.DeleteDriversFailure,
  props<{ error: any }>()
);


export const deleteDriverFromRealtimeSuccess = createAction(
  DriverActionTypes.DeleteDriverFromRealtimeSuccess,
  props<{ id: number }>()
);
export const deleteDriverFromRealtimeFailure = createAction(
  DriverActionTypes.DeleteDriverFromRealtimeFailure,
  props<{ error: any }>()
);
