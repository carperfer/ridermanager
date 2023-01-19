import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Order, PaymentType } from 'src/app/interfaces/orders';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Address } from 'src/app/interfaces/google-data';
import { Store } from '@ngrx/store';
import { updateOrder, updateOrderSuccess } from 'src/app/store/actions/order.actions';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/store/reducers';
import { Subscription } from 'rxjs';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { GoogleAddressComponent } from '../google-address/google-address.component';
@Component({
  selector: 'app-order-edit-dialog',
  templateUrl: './order-edit-dialog.component.html',
  styleUrls: ['./order-edit-dialog.component.scss'],
  providers: [DatePipe]
})
export class OrderEditDialogComponent implements OnInit {
  @ViewChild('googlePickupAddress') googlePickupAddress: GoogleAddressComponent;
  @ViewChild('googleDeliveryAddress') googleDeliveryAddress: GoogleAddressComponent;
  editOrderForm: FormGroup;

  editOrderSuccess$: Subscription;
  paymentTypes$: Subscription;
  deliveryLat: number;
  deliveryLng: number;
  pickUpLat: number;
  pickUpLng: number;
  order: Order;
  selectedStatus: any;
  noRiderError: boolean;

  payment_method_options: PaymentType[];
  is_already_paid_options: PaymentType[];

  constructor(private translate: TranslateService, private datepipe: DatePipe, private ordersService: OrdersService, private message: ShowMessageService, public config: DynamicDialogConfig, public dialog: DynamicDialogRef, private fb: FormBuilder, private store: Store<AppState>, private _actions$: Actions) {
    this.noRiderError = false;

    let data = this.config.data.order
    this.order = data
    this.deliveryLat = this.order.delivery_info.lat
    this.deliveryLng = this.order.delivery_info.lon
    this.pickUpLat = this.order.pickup_info.lat
    this.pickUpLng = this.order.pickup_info.lon
    this.editOrderForm = this.fb.group({
      pickupName: [data.pickup_info.name, [Validators.required]],
      pickupAddress: [data.pickup_info.address, [Validators.required]],
      pickupInfo: [data.pickup_info.address_info],
      pickupZip: [data.pickup_info.zip, [Validators.required]],
      pickupCity: [data.pickup_info.city, [Validators.required]],
      pickupPhone: [data.delivery_info.phone, [Validators.required]],
      pickupDate: [new Date(data.pickup_at), [Validators.required]],
      pickupTime: [new Date(data.pickup_at), [Validators.required]],
      deliveryName: [data.delivery_info.name, [Validators.required]],
      deliveryAddress: [data.delivery_info.address, [Validators.required]],
      deliveryInfo: [data.delivery_info.address_info],
      deliveryZip: [data.delivery_info.zip, [Validators.required,]],
      deliveryCity: [data.delivery_info.city, [Validators.required,]],
      deliveryPhone: [data.delivery_info.phone, [Validators.required,]],
      deliveryTime: [new Date(data.deliver_at), [Validators.required,]],
      orderNumber: [data.number, [Validators.required,]],
      amount: [data.total / 100, Validators.required],
      paymentMethod: [data.payment_type_id, Validators.required],
      isPaid: [data.is_already_paid, Validators.required],
      moneyChange: [data.money_change / 100],
      comments: [data.comments]
    });

    this.is_already_paid_options = [
      {
        "name": this.translate.instant('orders.yes'),
        "id": 1
      },
      {
        "name": this.translate.instant('orders.no'),
        "id": 0
      }
    ];
  }

  ngOnInit() {
    this.paymentTypes$ = this.ordersService.getAllPaymentTypes().subscribe({
      next: payment_types => {
        this.payment_method_options = payment_types;
        this.payment_method_options.forEach(payment_method => payment_method.name = this.translate.instant('orders.' + payment_method.name))
      }
    });

    this.editOrderSuccess$ = this._actions$.pipe(ofType(updateOrderSuccess)).subscribe(() => {
      this.dialog.close();
      this.message.showMessage('success', 'orders.success', 'orders.order_updated');
    });
  }

  ngOnDestroy() {
    if (this.paymentTypes$) this.paymentTypes$.unsubscribe();
    if (this.editOrderSuccess$) this.editOrderSuccess$.unsubscribe();
  }

  public updateChanges() {
    this.editOrderForm.markAllAsTouched();

    if (this.editOrderForm.value.pickupAddress === '' || this.editOrderForm.value.deliveryAddress === '') {
      this.message.showMessage('error', 'orders.error', 'orders.google_address_error');

      if (this.editOrderForm.value.pickupAddress === '') this.googlePickupAddress.markError();
      if (this.editOrderForm.value.deliveryAddress === '') this.googleDeliveryAddress.markError();
      return;
    }

    if (this.editOrderForm.invalid) {
      Object.keys(this.editOrderForm.controls).forEach(key => {
        this.editOrderForm.get(key)?.markAsDirty();
      });

      this.message.showMessage('error', 'orders.error', 'orders.requiredError');
      return '';
    }
    this.mapData();
    this.store.dispatch(updateOrder({ order: this.order }));
  }

  private mapData() {
    // Get date and add one more day to delivery if hour is less than pickup's
    let pickupDate = this.datepipe.transform(this.editOrderForm.value.pickupDate, 'yyyy-MM-dd');
    let deliveryDate =  this.editOrderForm.value.pickupTime.getHours() > this.editOrderForm.value.deliveryTime.getHours()
        ? this.datepipe.transform(this.editOrderForm.value.pickupDate.setDate(this.editOrderForm.value.pickupDate.getDate() + 1), 'yyyy-MM-dd')
        : this.datepipe.transform(this.editOrderForm.value.pickupDate, 'yyyy-MM-dd');

    this.order.pickup_at = this.datepipe.transform(new Date(`${pickupDate} ${this.editOrderForm.value.pickupTime.getHours()}:${this.editOrderForm.value.pickupTime.getMinutes()}`), 'yyyy-MM-dd HH:mm:ss') || new Date;
    this.order.deliver_at = this.datepipe.transform(new Date(`${deliveryDate} ${this.editOrderForm.value.deliveryTime.getHours()}:${this.editOrderForm.value.pickupTime.getMinutes()}`), 'yyyy-MM-dd HH:mm:ss') || new Date;

    this.order.pickup_info.name = this.editOrderForm.value.pickupName;
    this.order.pickup_info.phone = this.editOrderForm.value.pickupPhone;
    this.order.pickup_info.address = this.editOrderForm.value.pickupAddress;
    this.order.pickup_info.address_info = this.editOrderForm.value.pickupInfo;
    this.order.pickup_info.zip = this.editOrderForm.value.pickupZip;
    this.order.pickup_info.city = this.editOrderForm.value.pickupCity;
    this.order.pickup_info.lat = this.pickUpLat
    this.order.pickup_info.lon = this.pickUpLng

    this.order.delivery_info.name = this.editOrderForm.value.deliveryName;
    this.order.delivery_info.phone = this.editOrderForm.value.deliveryPhone;
    this.order.delivery_info.address = this.editOrderForm.value.deliveryAddress;
    this.order.delivery_info.address_info = this.editOrderForm.value.deliveryInfo ? this.editOrderForm.value.deliveryInfo : '';
    this.order.delivery_info.zip = this.editOrderForm.value.deliveryZip;
    this.order.delivery_info.city = this.editOrderForm.value.deliveryCity;
    this.order.delivery_info.lat = this.deliveryLat
    this.order.delivery_info.lon = this.deliveryLng

    this.order.number = this.editOrderForm.value.orderNumber;
    this.order.comments = this.editOrderForm.value.comments;

    this.order.total = this.editOrderForm.value.amount * 100;
    this.order.payment_type_id = this.editOrderForm.value.paymentMethod;
    this.order.is_already_paid = this.editOrderForm.value.isPaid;
    this.order.money_change = this.editOrderForm.value.moneyChange * 100;
  }

  public addAnHour() {
    let currentTime: Date = new Date(this.editOrderForm.value.pickupTime.getTime());
    currentTime.setHours(currentTime.getHours() + 1);
    this.editOrderForm.patchValue({ deliveryTime: currentTime })
  }

  public fillInPickUpAddress(address: Address) {
    this.editOrderForm.patchValue({
      pickupZip: address.zip,
      pickupCity: address.city,
    });
    this.pickUpLat = address.lat
    this.pickUpLng = address.lng
  }

  public fillInDeliveryAddress(address: Address) {
    this.editOrderForm.patchValue({
      deliveryZip: address.zip,
      deliveryCity: address.city,
    });
    this.deliveryLat = address.lat
    this.deliveryLng = address.lng
  }
}
