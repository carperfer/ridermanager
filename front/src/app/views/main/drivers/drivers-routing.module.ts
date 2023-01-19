import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversGuard } from 'src/app/guards/drivers.guard';
import { DriversComponent } from './drivers.component';

const routes: Routes = [
  {
    path: '',
    component: DriversComponent,
    canActivate: [DriversGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule { }
