import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyNewDialogComponent } from './company-new-dialog.component';

const routes: Routes = [
    {
        path: '',
        component: CompanyNewDialogComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyNewDialogRoutingModule { }