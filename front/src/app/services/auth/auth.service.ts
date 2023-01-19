import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { LoginCredentials, LoginData, LoginParams } from 'src/app/interfaces/users';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private webSocketService: WebsocketService) { }

  public login(credentials: LoginCredentials): Observable<any>{
    return this.http.post<any>(this.apiUrl + "login", credentials).pipe(tap(res => this.setSession(res)));
  }

  public logout(): Observable<any> {
    return this.http.post<LoginParams>(this.apiUrl + "logout", '').pipe(tap(res => this.removeSession()));
  }

  public isLogged(): boolean { 
    return !!localStorage.getItem('token')
  }
  
  private setSession(loginData: LoginData): void {
    localStorage.setItem('token', JSON.stringify({access_token: loginData.access_token, type: loginData.token_type}));
    localStorage.setItem('expires_in', JSON.stringify(loginData.expires_in));
  }

  private removeSession(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('expires_in')
    localStorage.removeItem('user')
    this.webSocketService.removeAllListeners()
  }
}
