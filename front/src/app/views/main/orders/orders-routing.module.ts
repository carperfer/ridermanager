import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./list-orders/list-orders.module').then(module => module.ListOrdersModule)
      },
      {
        path: 'add',
        pathMatch: 'full',
        loadChildren: () => import('./order-new-dialog/order-new-dialog.module').then(module => module.OrderNewDialogModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
