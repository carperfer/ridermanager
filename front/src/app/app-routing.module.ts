import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { SessionGuard } from './guards/session.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () => import('./views/auth/login/login.module').then(module => module.LoginModule),
    canActivate: [SessionGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./views/auth/sign-up/sign-up.module').then(module => module.SignUpModule),
    canActivate: [SessionGuard]
  },
  {
    path: 'recover-password',
    pathMatch: 'full',
    loadChildren: () => import('./views/auth/recover-password/recover-password.module').then(module => module.RecoverPasswordModule),
    canActivate: [SessionGuard]
  },
  {
    path: 'new-password',
    loadChildren: () => import('./views/auth/new-password/new-password.module').then(module => module.NewPasswordModule),
  },
  {
    path: 'view',
    loadChildren: () => import('./views/views.module').then(module => module.ViewsModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./views/main/order-new-landing/order-new-landing.module').then(module => module.OrderNewLandingModule)
  },
  {
    path: 'invite-signup',
    loadChildren: () => import('./views/main/invite-sign-up/invite-sign-up.module').then(module => module.InviteSignUpModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
