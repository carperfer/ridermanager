import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryLandingModule } from './order-history-landing/order-history-landing.module';
import { OrderNewLandingComponent } from './order-new-landing.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ':token',
                component: OrderNewLandingComponent,
                children: [
                    {
                        path: 'form',
                        loadChildren: () => import('./external-link-form/external-link-form.module').then(module => module.ExternalLinkFormModule)
                    },
                    {
                        path: 'history',
                        loadChildren: () => import('./order-history-landing/order-history-landing.module').then(module => module.OrderHistoryLandingModule)
                    }
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderNewLandingRoutingModule { }