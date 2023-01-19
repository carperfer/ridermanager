import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryLandingRoutingModule } from './order-history-landing-routing.module';
import { OrderHistoryLandingComponent } from './order-history-landing.component';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ListboxModule } from 'primeng/listbox';
import { ChipStatusComponent } from 'src/app/shared/chip-status/chip-status.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [OrderHistoryLandingComponent],
  imports: [
    CommonModule,
    OrderHistoryLandingRoutingModule,
    TableModule,
    TranslateModule,
    ListboxModule,
    SharedModule,
    InputTextModule
  ],
  entryComponents: [ChipStatusComponent]
})
export class OrderHistoryLandingModule { }
