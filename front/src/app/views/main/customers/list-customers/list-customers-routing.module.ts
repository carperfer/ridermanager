import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersGuard } from 'src/app/guards/customers.guard';
import { ListCustomersComponent } from './list-customers.component';

const routes: Routes = [
  {
    path: '',
    component: ListCustomersComponent,
    canActivate: [CustomersGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListCustomersRoutingModule { }
