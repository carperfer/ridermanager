import { createReducer, on } from '@ngrx/store';
import { Driver } from 'src/app/interfaces/drivers';
import * as driverActions from '../actions/driver.actions'


export const initialState: Driver[] = [];


const _driverReducer =
  createReducer(
    initialState,
    on(driverActions.loadDriversSuccess, (state, { data }) => data),
    on(driverActions.addDriversFromRealtimeSuccess, (state, { driver }) => {
      if (state.some(existingDriver => existingDriver.id === driver.id)) return [...JSON.parse(JSON.stringify(state))]
      else return [...JSON.parse(JSON.stringify(state)), driver];
    }),
    on(driverActions.updateDriversFromRealtimeSuccess, (state, { updatedDriver }) => {
      return state.map(driver => {
        if (driver.id === updatedDriver.id) {
          return {
            ...updatedDriver
          }
        }
        else {
          return driver
        }
      });
    }),
    on(driverActions.deleteDriversSuccess, (state, { ids }) => {
      return [...state.filter(driver => {
        let notDeleted = true;
        ids.forEach(id => {
          if (driver.id === id) notDeleted = false;
        })
        return notDeleted;
      })]
    }),
    on(driverActions.deleteDriverFromRealtimeSuccess, (state, { id }) => {
      return [...state.filter(driver => driver.id != id)]
    }),
  )

export function driverReducer(state: any, action: any) {
  return _driverReducer(state, action);
}

