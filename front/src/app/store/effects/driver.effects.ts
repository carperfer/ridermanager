import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects/';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DriversService } from 'src/app/services/drivers/drivers.service';
import { deleteDriversFailure, deleteDriversSuccess, DriverActionTypes, loadDrivers, loadDriversFailure, loadDriversSuccess } from '../actions/driver.actions';

@Injectable()
export class DriverEffects {

  constructor(private actions$: Actions, private driversService: DriversService) { }

  loadDrivers = createEffect(() =>
    this.actions$.pipe(
      ofType(DriverActionTypes.LoadDrivers),
      mergeMap((action) => this.driversService.getDrivers(action['company_id'])
        .pipe(
          map((drivers) => {
            return loadDriversSuccess({ data: drivers })
          }),
          catchError((error) => of(loadDriversFailure(error)))
        )
      )
    )
  )

  deleteDrivers = createEffect(() =>
    this.actions$.pipe(
      ofType(DriverActionTypes.DeleteDrivers),
      mergeMap((action) => this.driversService.deleteDrivers(action['ids'])
        .pipe(
          map(() => {
            return deleteDriversSuccess({ ids: action['ids'] });
          }),
          catchError((error) => of(deleteDriversFailure(error)))
        )
      )
    )
  )

}
