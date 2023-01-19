import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListCustomersRoutingModule } from './list-customers-routing.module';
import { ListCustomersComponent } from './list-customers.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [ListCustomersComponent],
  imports: [
    CommonModule,
    ListCustomersRoutingModule,
    TranslateModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    MessagesModule,
    DynamicDialogModule
  ],
  providers: [ConfirmationService],
})
export class ListCustomersModule { }
