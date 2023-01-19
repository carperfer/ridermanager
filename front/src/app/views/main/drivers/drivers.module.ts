import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { InvitationCardComponent } from './components/invitation-card/invitation-card.component';
import { TagModule } from "primeng/tag";
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DriversComponent, InvitationCardComponent],
  imports: [
    CommonModule,
    DriversRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    ConfirmDialogModule,
    SelectButtonModule,
    DataViewModule,
    ConfirmPopupModule,
    TagModule,
    SharedModule
  ],
  providers: [ConfirmationService]
})
export class DriversModule { }
