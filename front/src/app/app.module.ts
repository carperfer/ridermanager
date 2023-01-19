import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';

import { UsersService } from './services/users/users.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { OrderEffects } from './store/effects/order.effects';
import { CustomerEffects } from './store/effects/customer.effects';
import { DriverEffects } from './store/effects/driver.effects';
import { CompanyEffects } from './store/effects/company.effects';

const config: SocketIoConfig = { url: environment.wsUrl, options: {} };
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastModule,
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:10000'
    }),
    EffectsModule.forRoot([OrderEffects, CustomerEffects, DriverEffects, CompanyEffects]),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        // if you want to change complexe objects and that we have. We need to disable these settings
        // change strictStateImmutability, strictActionImmutability
        strictStateImmutability: false, // set this to false
        strictActionImmutability: false,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    UsersService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
