import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrdersGuard } from 'src/app/guards/create-orders.guard';
import { OrderNewDialogComponent } from './order-new-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: OrderNewDialogComponent,
    canActivate: [CreateOrdersGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderNewDialogRoutingModule { }
