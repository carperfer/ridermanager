import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver, OrderStatusFromDriver, Role } from 'src/app/interfaces/drivers';
import { AuthUser, Company } from 'src/app/interfaces/users';
import { environment } from "../../../environments/environment";
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})

export class DriversService {

  private authUser: AuthUser = new AuthUser("", "");
  private apiUrl = environment.apiUrl;
  private company: Company;

  private STATUS_COLORS: string[];

  constructor(private http: HttpClient, private usersService: UsersService) {
    this.STATUS_COLORS = [
      "muted",
      "info",
      "warning",
      "warning",
      "success"
    ]
  }

  public getDrivers(company_id: number): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl + "users?company_id=" + company_id);
  }

  public getInvitations() {
    const company = this.usersService.getActiveCompany();
    return this.http.get<[]>(this.apiUrl + "invites?company_id=" + company.id);
  }

  public getRoles() {
    return this.http.get<[Role]>(this.apiUrl + "roles");
  }

  public updateDriver(driver: Driver) {
    return this.http.put(this.apiUrl + "users/" + driver.id, driver).toPromise();
  }

  public deleteDrivers(drivers_id: number[]) {
    const company = this.usersService.getActiveCompany();
    return this.http.post(this.apiUrl + "users/bulk-delete?company_id=" + company.id, { users_id: drivers_id });
  }

  public sendInvite(email: string, role: number) {
    const company = this.usersService.getActiveCompany();
    return this.http.post(this.apiUrl + "invites", { email: email, role_id: role, company_id: company.id }).toPromise();
  }

  public deleteInvite(inviteid: number) {
    return this.http.delete(this.apiUrl + "invites/" + inviteid).toPromise();
  }

  public getStatusColor(id: number) {
    return this.STATUS_COLORS[id];
  }

  public getAllStatus(): Observable<OrderStatusFromDriver[]> {
    return this.http.get<OrderStatusFromDriver[]>(this.apiUrl + "statuses");
  }
}
