import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { AuthUser, Company, LoginParams, RecoverUser, UserInfo, RegisterUser, RegisterUserInvite } from 'src/app/interfaces/users';
import { Observable, throwError } from 'rxjs';
import { ChangePasswordRequest } from 'src/app/interfaces/change-password-request';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private authUser: AuthUser = new AuthUser("", "");
  private recoverUser: RecoverUser = new RecoverUser("");
  private apiUrl = environment.apiUrl
  private activeUser: UserInfo;
  private geocoder: any;

  constructor(private http: HttpClient) {
    this.geocoder = new google.maps.Geocoder();
  }

  //Send post for recover password
  public recoverPassword(recoverUser: any): Promise<LoginParams> {
    return this.http.post<LoginParams>(this.apiUrl + "forgot", recoverUser).toPromise();
  }

  public getAsyncUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.apiUrl + "users/logged").pipe(tap(user => this.setUserData(user)))
  }

  private setUserData(userData: any) {
    this.activeUser = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  }
  // public getAsyncCompany(): Promise<Driver> {
  //   let login = this.getUserLocalStorage();
  //   return this.http.get<Company>(this.apiUrl+"company/"+login.getUID(), {
  //     headers: new HttpHeaders({
  //       Accept: "*/*",
  //       Authorization: 'Bearer ' + login.access_token /*login.getToken()*/
  //     })
  //   }).toPromise()
  //     .then(user => this.activeUser = user);
  // }

  public getActiveUser(): UserInfo {
    if (this.activeUser) {
      return this.activeUser;
    } else {
      return <UserInfo>JSON.parse(localStorage.getItem('user')!);
    }
  }

  public getAllCompanies(): Promise<Company[]> {
    return this.http.get<Company[]>(this.apiUrl + 'companies').toPromise();
  }

  // public getActiveCompany(): Promise<Company> {
  //   return this.http.get<Company>(this.apiUrl + "companies/" + this.getActiveUser().company_id).toPromise();
  // }

  public getUserLocalStorage(): LoginParams {
    let getLocalS: string = <string>localStorage.getItem('token');
    let user = JSON.parse(getLocalS);
    Object.setPrototypeOf(user, LoginParams.prototype);

    return user;
  }

  public registerUser(registerUser: RegisterUser): Promise<any> {
    return this.http.post<Object>(this.apiUrl + "register", registerUser).toPromise();
  }


  public editUser(userInfo: UserInfo) {
    return this.http.put(`${this.apiUrl}users/${userInfo.id}`, userInfo).toPromise();
  }

  public changePassword(passwords: ChangePasswordRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}users/credentials`, passwords)
  }
  public editCompany(company: Company) {
    return this.http.put(`${this.apiUrl}companies/${company.id}`, company).toPromise();
  }

  public createCompany(company_name: { name: string }) {
    return this.http.post(`${this.apiUrl}companies/`, company_name)
  }

  public accept_invitation(registerUserInvite: RegisterUserInvite) {
    return this.http.post(this.apiUrl + "users", registerUserInvite).toPromise();
  }

  public comprove_token(token: string) {
    return this.http.get(`${this.apiUrl}invites/${token}`).toPromise().then(response => {
      return response;
    }).catch(err => err.error.code);
  }

  public checkUserToken(token: string) {
    return this.http.get(`${this.apiUrl}reset/${token}`).toPromise();
  }

  public resetPassword(newPasswordObject: {}) {
    return this.http.post(`${this.apiUrl}reset`, newPasswordObject).toPromise();
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  public checkPermission(permissionName: string) {
    const company = this.getActiveCompany();
    return company.role.permissions.some((permission: string) => permission === permissionName)
  }

  public getActiveCompany() {
    const company = JSON.parse(localStorage.getItem('company') || 'null');
    if (company) return company
    else {
      let user = this.getActiveUser();
      if (user) {
        return user.companies[0];
      } else {
        this.getAsyncUser().subscribe(user => user.companies[0]);
      }
    }
  }

}
