import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

import { UserRoutingModule } from './user-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    AvatarModule,
    InputTextModule,
    ReactiveFormsModule,
    TranslateModule,
    CardModule,
    ButtonModule
  ]
})
export class UserModule { }
