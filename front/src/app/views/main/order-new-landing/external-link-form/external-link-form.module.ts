import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLinkFormRoutingModule } from './external-link-form-routing.module';
import { ExternalLinkFormComponent } from './external-link-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [ExternalLinkFormComponent],
  imports: [
    CommonModule,
    ExternalLinkFormRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule
  ]
})
export class ExternalLinkFormModule { }
