import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteSignUpRoutingModule } from './invite-sign-up-routing.module';
import { InviteSignUpComponent } from './invite-sign-up.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [InviteSignUpComponent],
  imports: [
    CommonModule,
    InviteSignUpRoutingModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    ReactiveFormsModule,
    CardModule
  ]
})
export class InviteSignUpModule { }
