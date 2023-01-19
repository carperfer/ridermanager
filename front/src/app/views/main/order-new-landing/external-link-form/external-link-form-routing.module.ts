import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalLinkFormComponent } from './external-link-form.component';

const routes: Routes = [
  {
    path: '',
    component: ExternalLinkFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLinkFormRoutingModule { }
