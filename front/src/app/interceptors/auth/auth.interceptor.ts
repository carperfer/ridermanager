import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (localStorage.getItem('token')) {
      let token = JSON.parse(localStorage.getItem('token') || '');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.access_token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError(error => {
        console.warn(error);

        if ((error.status === 404 && error.error.error.substring(0, 5) === 'attr_')
          || (error.status === 404 && error.error.error.substring(0, 5) === 'model')) {
          const dynamicInfo: string[] = error.error.error.split('_');
          this.errorService.showError(error.error.error, dynamicInfo[1]);
        } else if (error.status === 502) {
          this.errorService.showError('no_service', '');
        } else {
          this.errorService.showError(error.error.error, '');
        }

        if (error.status === 401 && error.error.error !== 'wrong_credentials') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('company');
          this.router.navigate(['/login']);
        }
        return throwError('Invalid HTTP Request');
      })
    )
  }

}
