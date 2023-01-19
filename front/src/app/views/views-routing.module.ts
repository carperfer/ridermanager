import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './main/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () => import('./main/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./main/orders/orders.module').then(module => module.OrdersModule)
      },
      {
        path: 'drivers',
        pathMatch: 'full',
        loadChildren: () => import('./main/drivers/drivers.module').then(module => module.DriversModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./main/customers/customers.module').then(module => module.CustomersModule)
      },
      {
        path: 'map',
        pathMatch: 'full',
        loadChildren: () => import('./main/map/map.module').then(module => module.MapModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./main/profile/profile.module').then(module => module.ProfileModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ViewsRoutingModule { }