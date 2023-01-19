import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomerEditDialogComponent } from '../customers/customer-edit-dialog/customer-edit-dialog.component';

import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CustomersComponent, CustomerEditDialogComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SharedModule
  ]
})
export class CustomersModule { }
