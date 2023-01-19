import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteSignUpComponent } from './invite-sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: InviteSignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteSignUpRoutingModule { }
