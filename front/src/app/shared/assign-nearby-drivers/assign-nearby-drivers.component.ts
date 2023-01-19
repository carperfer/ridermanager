import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/interfaces/drivers';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { updateRider, updateRiderSuccess } from 'src/app/store/actions/order.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-assign-nearby-drivers',
  templateUrl: './assign-nearby-drivers.component.html',
  styleUrls: ['./assign-nearby-drivers.component.scss']
})
export class AssignNearbyDriversComponent implements OnInit {

  drivers: Driver[];
  assignDriver$: Subscription;

  constructor(public config: DynamicDialogConfig, private store: Store<AppState>, private _actions$: Actions, private message: ShowMessageService, public dialog: DynamicDialogRef) { }

  ngOnInit() {
    let orderCoords = new google.maps.LatLng(this.config.data.order.pickup_info.lat, this.config.data.order.pickup_info.lon);
    this.drivers = [...this.config.data.drivers];

    this.drivers.forEach((driver: Driver) => {
      if (driver.online) {
        //Calculates distance between order and driver
        let driverCoords = new google.maps.LatLng(driver.location.lat, driver.location.lon);
        driver.distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(driverCoords, orderCoords) / 100) / 10;
        driver.timeFromLastConnection = Math.round((new Date().getTime() - new Date(driver.location.updated_at).getTime()) / 60000);
      }
    });

    //In this sorting function we hardcode a 100000 in order to push the offline drivers to the bottom
    this.drivers.sort(function (a, b) { return (b.distance || 100000) - (a.distance || 0) });

    this.assignDriver$ = this._actions$.pipe(ofType(updateRiderSuccess)).subscribe(() => {
      this.message.showMessage('success', 'orders.success', 'orders.rider_assign');
      this.dialog.close();
    })
  }

  ngOnDestroy() {
    if (this.assignDriver$) this.assignDriver$.unsubscribe();
  }

  public assignDriver(driver_id: number) {
    this.store.dispatch(updateRider({ order_id: this.config.data.order.id, driver_id: { user_id: driver_id } }));
  }

}
