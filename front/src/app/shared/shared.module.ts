import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCardComponent } from './order-card/order-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { orderFilter, isAssigned } from '../pipes/orders.pipe';
import { DriverCardComponent } from './driver-card/driver-card.component';
import { GoogleAddressComponent } from './google-address/google-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderEditDialogComponent } from './order-edit-dialog/order-edit-dialog.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ChipStatusComponent } from './chip-status/chip-status.component';
import { ChipRiderComponent } from './chip-rider/chip-rider.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipAmountComponent } from './chip-amount/chip-amount.component';
import { FormatCurrencyPipe } from "../pipes/format-currency.pipe";
import { ListboxModule } from 'primeng/listbox';
import { AssignNearbyDriversComponent } from './assign-nearby-drivers/assign-nearby-drivers.component';
import { OrderCancelDialogComponent } from "./order-cancel-dialog/order-cancel-dialog.component";


@NgModule({
  declarations: [OrderCardComponent, DriverCardComponent, orderFilter, isAssigned, FormatCurrencyPipe,
    GoogleAddressComponent,
    OrderEditDialogComponent,
    OrderHistoryComponent,
    ChipStatusComponent,
    ChipRiderComponent,
    ChipAmountComponent,
    AssignNearbyDriversComponent,
    OrderCancelDialogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ChipModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    StepsModule,
    InputNumberModule,
    ListboxModule
  ],
  exports: [OrderCardComponent, DriverCardComponent, orderFilter, isAssigned,
    GoogleAddressComponent, OrderEditDialogComponent,
    OrderHistoryComponent, ChipStatusComponent, ChipRiderComponent, ChipAmountComponent, AssignNearbyDriversComponent, OrderCancelDialogComponent]
})
export class SharedModule { }
