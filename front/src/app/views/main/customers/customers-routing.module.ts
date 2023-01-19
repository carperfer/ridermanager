import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersGuard } from 'src/app/guards/customers.guard';
import { CustomersComponent } from './customers.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./list-customers/list-customers.module').then(module => module.ListCustomersModule)
      },
      {
        path: 'add',
        pathMatch: 'full',
        loadChildren: () => import('./customer-new-dialog/customer-new-dialog.module').then(module => module.CustomerNewDialogModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
