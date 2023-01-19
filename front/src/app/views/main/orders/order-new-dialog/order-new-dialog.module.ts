import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderNewDialogRoutingModule } from './order-new-dialog-routing.module';
import { OrderNewDialogComponent } from './order-new-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OrderNewDialogComponent],
  imports: [
    CommonModule,
    OrderNewDialogRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    AutoCompleteModule,
    InputNumberModule,
    SelectButtonModule,
    SharedModule
  ],
})
export class OrderNewDialogModule { }
