import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/interfaces/customers';
import { Address } from 'src/app/interfaces/google-data';
import { OrderFromCustomer, PaymentType } from 'src/app/interfaces/orders';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAddressComponent } from 'src/app/shared/google-address/google-address.component';
import { Subscription } from 'rxjs';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';

@Component({
  selector: 'app-external-link-form',
  templateUrl: './external-link-form.component.html',
  styleUrls: ['./external-link-form.component.scss'],
  providers: [DatePipe],
})
export class ExternalLinkFormComponent implements OnInit {

  @ViewChild('googleAddress') googleAddress: GoogleAddressComponent;

  addOrderFromCustomer$: Subscription;
  paymentType$: Subscription;

  externalLinkForm: FormGroup;
  externalId: string;
  order: OrderFromCustomer;
  customer: Customer;
  deliveryLat: number;
  deliveryLng: number;
  payment_method_options: PaymentType[];
  is_already_paid_options: PaymentType[];

  pDate = "";
  pTime = "";
  dTime = "";

  constructor(private ordersService: OrdersService, private customersService: CustomersService, private route: ActivatedRoute, private router: Router, private datepipe: DatePipe, private translate: TranslateService, private fb: FormBuilder, private message: ShowMessageService) {

    let actualdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    let actualPTime = this.datepipe.transform(new Date(), 'HH:mm');
    let actualDTime1 = new Date();
    actualDTime1.setHours(actualDTime1.getHours() + 1);

    this.pDate = actualdate ? actualdate : "";
    this.pTime = actualPTime ? actualPTime : "";

    this.externalLinkForm = this.fb.group({
      pickupDate: [new Date(), [Validators.required]],
      pickupTime: [new Date(), [Validators.required]],
      comments: [''],
      deliveryName: ['', [Validators.required]],
      deliveryAddress: ['', [Validators.required]],
      deliveryInfo: [''],
      zip: ['', [Validators.required,]],
      city: ['', [Validators.required,]],
      phone: ['', [Validators.required,]],
      deliveryTime: [actualDTime1, [Validators.required]],
      amount: [0, Validators.required],
      paymentMethod: ['', Validators.required],
      isPaid: ['', Validators.required],
      moneyChange: [0]
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

  async ngOnInit() {
    this.externalId = this.route.parent?.snapshot.parent?.params.token;

    this.paymentType$ = this.ordersService.getAllPaymentTypes().subscribe({
      next: payment_types => {
        this.payment_method_options = payment_types;
        this.payment_method_options.forEach(payment_method => payment_method.name = this.translate.instant('orders.' + payment_method.name))
      }
    });

    this.customersService.getByTokenId(this.externalId)
      .then((response) => this.customer = response)
      .catch(() => this.router.navigate(['auth']))

  }

  ngOnDestroy() {
    if (this.paymentType$) this.paymentType$.unsubscribe();
    if (this.addOrderFromCustomer$) this.addOrderFromCustomer$.unsubscribe();
  }

  public createOrder() {
    this.externalLinkForm.markAllAsTouched();

    if (this.externalLinkForm.value.deliveryAddress === '') {
      this.message.showMessage('error', 'orders.error', 'orders.google_address_error');
      this.googleAddress.markError();
      return;
    }

    if (this.externalLinkForm.invalid) {
      Object.keys(this.externalLinkForm.controls).forEach(key => {
        this.externalLinkForm.get(key)?.markAsDirty();
      });
      this.message.showMessage('error', 'orders.error', 'orders.requiredError');
      return;
    }

    this.mapData();

    this.ordersService.createOrderFromCustomer(this.order).subscribe(() => {
      this.message.showMessage('success', 'orders.success', 'orders.order_created')

      let actualDTime1 = new Date();
      actualDTime1.setHours(actualDTime1.getHours() + 1);

      this.externalLinkForm.reset();
      this.googleAddress.reset();
      this.externalLinkForm.patchValue({
        pickupDate: new Date(),
        pickupTime: new Date(),
        deliveryTime: actualDTime1,
        deliveryInfo: "",
        comments: "",
        amount: 0
      });
    });

  }

  private mapData() {
    let actualdate = this.datepipe.transform(this.externalLinkForm.value.pickupDate, 'yyyy-MM-dd');

    this.order = {
      pickup_at: this.datepipe.transform(new Date(`${actualdate} ${this.externalLinkForm.value.pickupTime.getHours()}:${this.externalLinkForm.value.pickupTime.getMinutes()}`), 'yyyy-MM-dd HH:mm:ss') || new Date,
      deliver_at: this.datepipe.transform(new Date(`${actualdate} ${this.externalLinkForm.value.deliveryTime.getHours()}:${this.externalLinkForm.value.deliveryTime.getMinutes()}`), 'yyyy-MM-dd HH:mm:ss') || new Date,
      delivery_info: {
        name: this.externalLinkForm.value.deliveryName,
        phone: this.externalLinkForm.value.phone,
        address: this.externalLinkForm.value.deliveryAddress,
        address_info: this.externalLinkForm.value.deliveryInfo,
        zip: this.externalLinkForm.value.zip,
        city: this.externalLinkForm.value.city,
        lat: this.deliveryLat,
        lon: this.deliveryLng,
      },
      comments: this.externalLinkForm.value.comments,
      customer_id: this.customer.id,
      customer_external_id: this.customer.external_id,

      total: this.externalLinkForm.value.amount * 100,
      payment_type_id: this.externalLinkForm.value.paymentMethod,
      is_already_paid: this.externalLinkForm.value.isPaid,
      money_change: this.externalLinkForm.value.moneyChange * 100,
    }
  }

  public addAnHour() {
    let currentTime: Date = new Date(this.externalLinkForm.value.pickupTime.getTime());
    currentTime.setHours(currentTime.getHours() + 1);
    this.externalLinkForm.patchValue({ deliveryTime: currentTime })
  }

  public fillInAddress(address: Address) {
    this.externalLinkForm.patchValue({
      zip: address.zip,
      city: address.city,
    });
    this.deliveryLat = address.lat
    this.deliveryLng = address.lng
  }
}
