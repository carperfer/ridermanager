import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslateModule,
    SharedModule,
    ButtonModule,
    CardModule,
    DividerModule,
    DropdownModule,
    FormsModule,
    StoreModule,
    MultiSelectModule
  ]
})
export class DashboardModule { }
