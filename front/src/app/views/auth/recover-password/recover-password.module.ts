import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoverPasswordRoutingModule } from './recover-password-routing.module';
import { RecoverPasswordComponent } from './recover-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RecoverPasswordComponent
  ],
  imports: [
    CommonModule,
    RecoverPasswordRoutingModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    ReactiveFormsModule,
  ]
})
export class RecoverPasswordModule { }
