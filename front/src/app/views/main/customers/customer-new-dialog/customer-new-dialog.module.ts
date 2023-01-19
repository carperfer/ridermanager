import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerNewDialogRoutingModule } from './customer-new-dialog-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerNewDialogComponent } from './customer-new-dialog.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CustomerNewDialogComponent],
  imports: [
    CommonModule,
    CustomerNewDialogRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
    SharedModule
  ]
})
export class CustomerNewDialogModule { }
