import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Address } from 'src/app/interfaces/google-data';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { UsersService } from 'src/app/services/users/users.service';
import { GoogleAddressComponent } from 'src/app/shared/google-address/google-address.component';
import { addCustomer } from 'src/app/store/actions/customer.actions';


@Component({
  selector: 'app-customer-new-dialog',
  templateUrl: './customer-new-dialog.component.html',
  styleUrls: ['./customer-new-dialog.component.scss']
})
export class CustomerNewDialogComponent implements OnInit {

  @ViewChild('googleAddress') googleAddress: GoogleAddressComponent;

  newCustomerForm: FormGroup;

  constructor(private fb: FormBuilder, private message: ShowMessageService, private store: Store<{ orderState: any }>, private usersService: UsersService) { }

  ngOnInit() {
    this.newCustomerForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_info: [''],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      company_id: [this.usersService.getActiveCompany().id]
    });
  }

  public saveChanges() {
    this.newCustomerForm.markAllAsTouched();

    if (this.newCustomerForm.value.address === '') {
      this.message.showMessage('error', 'orders.error', 'orders.google_address_error');
      this.googleAddress.markError();
      return;
    }

    if (this.newCustomerForm.invalid) {
      Object.keys(this.newCustomerForm.controls).forEach(key => {
        this.newCustomerForm.get(key)?.markAsDirty();
      });
      this.message.showMessage('error', 'orders.error', 'orders.requiredError')
      return '';
    }

    this.store.dispatch(addCustomer({ customer: this.newCustomerForm.value }));
  }

  public fillInAddress(address: Address) {
    this.newCustomerForm.patchValue({
      zip: address.zip,
      city: address.city,
    });
  }

}
