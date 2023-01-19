import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Customer } from 'src/app/interfaces/customers';
import { Order, PaymentType } from 'src/app/interfaces/orders';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Address } from 'src/app/interfaces/google-data';
import { GoogleAddressComponent } from 'src/app/shared/google-address/google-address.component';
import { Store } from '@ngrx/store';
import { addOrder, addOrderSuccess } from 'src/app/store/actions/order.actions';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/store/reducers';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/users';
import { UsersService } from 'src/app/services/users/users.service';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';


@Component({
  selector: 'app-order-new-dialog',
  templateUrl: './order-new-dialog.component.html',
  styleUrls: ['./order-new-dialog.component.scss'],
  providers: [DatePipe]
})
export class OrderNewDialogComponent implements OnInit, OnDestroy {

  @ViewChild('googlePickupAddress') googlePickupAddress: GoogleAddressComponent;
  @ViewChild('googleDeliveryAddress') googleDeliveryAddress: GoogleAddressComponent;
  newOrderForm: FormGroup;

  addOrderSuccess$: Subscription;
  store$: Subscription;
  paymentTypes$: Subscription;

  company: Company;
  customers: Customer[];
  customerSuggestions: Customer[];
  order: Order;
  deliveryLat: number;
  deliveryLng: number;
  pickUpLat: number;
  pickUpLng: number;
  selectedCustomerId: number;
  selectedStatus: any;
  customerIsSelected: boolean;
  noRiderError: boolean;

  payment_method_options: PaymentType[];
  is_already_paid_options: PaymentType[];

  pDate = "";
  pTime = "";
  dTime = "";

  constructor(private translate: TranslateService, private datepipe: DatePipe, private ordersService: OrdersService, private usersService: UsersService, private fb: FormBuilder, private store: Store<AppState>, private _actions$: Actions, private message: ShowMessageService) {

    let today = this.datepipe.transform(new Date, 'yyyy-MM-dd');
    let actualPtime = this.datepipe.transform(new Date, 'HH:mm');
    let actualDtime1 = new Date;
    actualDtime1.setHours(actualDtime1.getHours() + 1);

    this.pDate = today ? today : "";
    this.pTime = actualPtime ? actualPtime : "";

    this.customerIsSelected = false;

    this.newOrderForm = this.fb.group({
      pickupName: ['', [Validators.required]],
      pickupAddress: ['', [Validators.required]],
      pickupInfo: [''],
      pickupZip: ['', [Validators.required]],
      pickupCity: ['', [Validators.required]],
      pickupPhone: ['', [Validators.required]],
      pickupDate: [new Date(), [Validators.required]],
      pickupTime: [new Date(), [Validators.required]],
      deliveryName: ['', [Validators.required]],
      deliveryAddress: ['', [Validators.required]],
      deliveryInfo: [''],
      deliveryZip: ['', [Validators.required]],
      deliveryCity: ['', [Validators.required]],
      deliveryPhone: ['', [Validators.required]],
      deliveryTime: [actualDtime1, [Validators.required]],
      orderNumber: ['', [Validators.required]],
      amount: [0, Validators.required],
      paymentMethod: ['', Validators.required],
      isPaid: ['', Validators.required],
      moneyChange: [0],
      comments: ['']
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


    this.order = new Order();

    let actualdate = this.datepipe.transform(new Date, 'yyyy-MM-dd');
    let actualPTime = this.datepipe.transform(new Date, 'HH:mm');
    let actualDTime1 = new Date;
    actualDTime1.setHours(actualDTime1.getHours() + 1);
    let actualDTime = this.datepipe.transform(actualDTime1, 'HH:mm');

    this.pDate = actualdate ? actualdate : "";
    this.pTime = actualPTime ? actualPTime : "";
    this.dTime = actualDTime ? actualDTime : "";

    this.noRiderError = false;
  }

  ngOnInit() {
    this.company = this.usersService.getActiveCompany();

    this.store$ = this.store.subscribe(store => {
      this.customers = store.customers;
      this.customerSuggestions = store.customers;
    });

    this.paymentTypes$ = this.ordersService.getAllPaymentTypes().subscribe({
      next: payment_types => {
        this.payment_method_options = payment_types;
        this.payment_method_options.forEach(payment_method => payment_method.name = this.translate.instant('orders.' + payment_method.name))
      }
    });

    this.addOrderSuccess$ = this._actions$.pipe(ofType(addOrderSuccess)).subscribe(() => {
      this.noRiderError = false;
      this.message.showMessage('success', 'orders.success', 'orders.order_created')


      this.newOrderForm.reset();
      this.googlePickupAddress.reset();
      this.googleDeliveryAddress.reset();

      let now = new Date();
      let actualDTime1 = new Date();
      actualDTime1.setHours(actualDTime1.getHours() + 1);

      this.newOrderForm.patchValue({
        pickupDate: now,
        pickupTime: now,
        deliveryTime: actualDTime1,
        amount: 0
      });
    });
  }

  ngOnDestroy() {
    if (this.store$) this.store$.unsubscribe();
    if (this.paymentTypes$) this.paymentTypes$.unsubscribe();
    if (this.addOrderSuccess$) this.addOrderSuccess$.unsubscribe();
  }

  public saveChanges() {
    this.newOrderForm.markAllAsTouched();

    if (this.newOrderForm.value.pickupAddress === '' || this.newOrderForm.value.deliveryAddress === '') {
      this.message.showMessage('error', 'orders.error', 'orders.google_address_error');

      if (this.newOrderForm.value.pickupAddress === '') this.googlePickupAddress.markError();
      if (this.newOrderForm.value.deliveryAddress === '') this.googleDeliveryAddress.markError();
      return;
    }

    if (this.newOrderForm.invalid) {
      Object.keys(this.newOrderForm.controls).forEach(key => {
        this.newOrderForm.get(key)?.markAsDirty();
      });

      this.message.showMessage('error', 'orders.error', 'orders.requiredError');
      return '';
    }

    this.mapData();
    if (this.selectedCustomerId) this.order.customer_id = this.selectedCustomerId;
    this.store.dispatch(addOrder({ order: this.order }))
  }

  private mapData() {
    // Get date and add one more day to delivery if hour is less than pickup's
    let pickupDate = this.datepipe.transform(this.newOrderForm.value.pickupDate, 'yyyy-MM-dd');
    let deliveryDate = this.newOrderForm.value.pickupTime.getHours() > this.newOrderForm.value.deliveryTime.getHours()
      ? this.datepipe.transform(this.newOrderForm.value.pickupDate.setDate(this.newOrderForm.value.pickupDate.getDate() + 1), 'yyyy-MM-dd')
      : this.datepipe.transform(this.newOrderForm.value.pickupDate, 'yyyy-MM-dd');

    this.order.pickup_at = this.datepipe.transform(new Date(`${pickupDate} ${this.newOrderForm.value.pickupTime.getHours()}:${this.newOrderForm.value.pickupTime.getMinutes()}`), 'yyyy-MM-dd HH:mm:ss') || new Date;
    this.order.deliver_at = this.datepipe.transform(new Date(`${deliveryDate} ${this.newOrderForm.value.deliveryTime.getHours()}:${this.newOrderForm.value.deliveryTime.getMinutes()}`), 'yyyy-MM-dd HH:mm:ss') || new Date;

    this.order.pickup_info.name = this.newOrderForm.value.pickupName.name ? this.newOrderForm.value.pickupName.name : this.newOrderForm.value.pickupName;
    this.order.pickup_info.phone = this.newOrderForm.value.pickupPhone;
    this.order.pickup_info.address = this.newOrderForm.value.pickupAddress;
    this.order.pickup_info.address_info = this.newOrderForm.value.pickupInfo ? this.newOrderForm.value.pickupInfo : '';
    this.order.pickup_info.zip = this.newOrderForm.value.pickupZip;
    this.order.pickup_info.city = this.newOrderForm.value.pickupCity;
    this.order.pickup_info.lat = this.pickUpLat
    this.order.pickup_info.lon = this.pickUpLng

    this.order.delivery_info.name = this.newOrderForm.value.deliveryName;
    this.order.delivery_info.phone = this.newOrderForm.value.deliveryPhone;
    this.order.delivery_info.address = this.newOrderForm.value.deliveryAddress;
    this.order.delivery_info.address_info = this.newOrderForm.value.deliveryInfo ? this.newOrderForm.value.deliveryInfo : '';
    this.order.delivery_info.zip = this.newOrderForm.value.deliveryZip;
    this.order.delivery_info.city = this.newOrderForm.value.deliveryCity;
    this.order.delivery_info.lat = this.deliveryLat
    this.order.delivery_info.lon = this.deliveryLng


    this.order.number = this.newOrderForm.value.orderNumber;
    this.order.comments = this.newOrderForm.value.comments ? this.newOrderForm.value.comments : '';
    this.order.company_id = this.company.id

    this.order.total = this.newOrderForm.value.amount * 100;
    this.order.payment_type_id = this.newOrderForm.value.paymentMethod;
    this.order.is_already_paid = this.newOrderForm.value.isPaid;
    this.order.money_change = this.newOrderForm.value.moneyChange * 100;
  }

  public addAnHour() {
    //Adds 1 hour to delivery time
    let currentTime: Date = new Date(this.newOrderForm.value.pickupTime.getTime());
    currentTime.setHours(currentTime.getHours() + 1);
    this.newOrderForm.patchValue({ deliveryTime: currentTime })
  }

  public filterCustomer(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let customer of this.customers) {
      if (customer?.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(customer);
      }
    }
    this.customerSuggestions = filtered;
  }

  public selectCustomerData(event: Customer) {
    //Fills customer data after choosing a customer from dropdown
    const customer: Customer = event;
    this.newOrderForm.patchValue({
      pickupAddress: customer.address,
      pickupInfo: customer.address_info,
      pickupZip: customer.zip,
      pickupCity: customer.city,
      pickupPhone: customer.phone
    });
    this.selectedCustomerId = customer.id;
    this.customerIsSelected = true;
    this.pickUpLat = customer.lat
    this.pickUpLng = customer.lon
  }

  public fillInPickUpAddress(address: Address) {
    this.newOrderForm.patchValue({
      pickupZip: address.zip,
      pickupCity: address.city,
    });
    this.pickUpLat = address.lat
    this.pickUpLng = address.lng
  }

  public fillInDeliveryAddress(address: Address) {
    this.newOrderForm.patchValue({
      deliveryZip: address.zip,
      deliveryCity: address.city,
    });
    this.deliveryLat = address.lat
    this.deliveryLng = address.lng
  }

}
