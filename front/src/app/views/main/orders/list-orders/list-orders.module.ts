import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListOrdersRoutingModule } from './list-orders-routing.module';
import { ListOrdersComponent } from './list-orders.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { OrderEditDialogComponent } from 'src/app/shared/order-edit-dialog/order-edit-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';


@NgModule({
  declarations: [
    ListOrdersComponent,
  ],
  imports: [
    CommonModule,
    ListOrdersRoutingModule,
    TranslateModule,
    SharedModule,
    TableModule,
    InputTextModule,
    ListboxModule,
    ButtonModule,

    DynamicDialogModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextareaModule,
    DropdownModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    MessagesModule
  ],
  providers: [ConfirmationService],
  entryComponents: [OrderEditDialogComponent]
})
export class ListOrdersModule { }
