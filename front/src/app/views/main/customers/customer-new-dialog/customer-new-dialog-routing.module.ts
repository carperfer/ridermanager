import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerNewDialogComponent } from './customer-new-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerNewDialogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerNewDialogRoutingModule { }
