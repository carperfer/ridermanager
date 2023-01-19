import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OrderEditDialogComponent } from 'src/app/shared/order-edit-dialog/order-edit-dialog.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SelectButtonModule,
    InputSwitchModule
  ],
  entryComponents: [OrderEditDialogComponent]
})
export class MapModule { }
