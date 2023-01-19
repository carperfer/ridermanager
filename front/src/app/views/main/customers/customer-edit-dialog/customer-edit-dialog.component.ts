import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Address } from 'src/app/interfaces/google-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Customer } from 'src/app/interfaces/customers';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { updateCustomer, updateCustomerSuccess } from 'src/app/store/actions/customer.actions';
import { Subscription } from 'rxjs';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { GoogleAddressComponent } from 'src/app/shared/google-address/google-address.component';
@Component({
  selector: 'app-customer-edit-dialog',
  templateUrl: './customer-edit-dialog.component.html',
  styleUrls: ['./customer-edit-dialog.component.scss'],
  providers: [DatePipe],
})


export class CustomerEditDialogComponent {

  @ViewChild('googleAddress') googleAddress: GoogleAddressComponent;

  editCustomerForm: FormGroup;
  customer: Customer;
  editOrderSuccess$: Subscription;

  constructor(private fb: FormBuilder, public config: DynamicDialogConfig, public dialog: DynamicDialogRef, private store: Store<{ orderState: any }>, private _actions$: Actions, private message: ShowMessageService) { }

  ngOnInit() {
    this.customer = this.config.data.customer;

    this.editCustomerForm = this.fb.group({
      name: [this.customer.name, [Validators.required]],
      phone: [this.customer.phone, [Validators.required]],
      address: [this.customer.address, [Validators.required]],
      address_info: [this.customer.address_info || ''],
      city: [this.customer.city, [Validators.required]],
      zip: [this.customer.zip, [Validators.required]],
    });

    this.editOrderSuccess$ = this._actions$.pipe(ofType(updateCustomerSuccess)).subscribe(() => {
      this.dialog.close();
      this.message.showMessage('success', 'orders.success', 'customers.updated');
    });
  }

  ngOnDestroy() {
    if (this.editOrderSuccess$) this.editOrderSuccess$.unsubscribe();
  }

  public saveChanges() {

    if (this.editCustomerForm.value.address === '') {
      this.message.showMessage('error', 'orders.error', 'orders.google_address_error');
      this.googleAddress.markError();
      return;
    }

    if (this.editCustomerForm.invalid) {
      Object.keys(this.editCustomerForm.controls).forEach(key => {
        this.editCustomerForm.get(key)?.markAsDirty();
      });
      this.message.showMessage('error', 'orders.error', 'orders.requiredError')
      return;
    }

    let editedCustomer = this.editCustomerForm.value
    editedCustomer.id = this.customer.id;
    this.store.dispatch(updateCustomer({ customer: editedCustomer }));
  }

  public fillInAddress(address: Address) {
    this.editCustomerForm.patchValue({
      zip: address.zip,
      city: address.city,
    });
  }

}
