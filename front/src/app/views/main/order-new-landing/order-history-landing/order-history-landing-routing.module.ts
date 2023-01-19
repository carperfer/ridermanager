import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryLandingComponent } from './order-history-landing.component';

const routes: Routes = [
  {
    path: '',
    component: OrderHistoryLandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderHistoryLandingRoutingModule { }
