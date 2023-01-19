import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Customer } from 'src/app/interfaces/customers';
import { GOOGLE_DATA } from 'src/app/interfaces/google-data';
import { environment } from "../../../environments/environment";
import { UsersService } from '../users/users.service';
@Injectable({
  providedIn: 'root'
})

export class CustomersService {

  private apiUrl = environment.apiUrl;
  private geocoder: any;

  constructor(private http: HttpClient, private usersService: UsersService) {
    this.geocoder = new google.maps.Geocoder();
  }

  public getCustomers(company_id: number): Observable<Customer[]> {
    return this.http.get<[Customer]>(this.apiUrl + "customers?company_id=" + company_id);
  }

  public getByTokenId(id: string) {
    return this.http.get(this.apiUrl + "customers/" + id).toPromise().then(response => {
      return response;
    }).catch(err => err.error.code);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return new Observable((observer) => {
      this.getCoordsPickup(customer)
        .subscribe(
          (data) => {
            this.http.post<Customer>(this.apiUrl + "customers", data).subscribe(newCustomer => {
              observer.next(newCustomer);
            });
          },
          (error) => {
            throwError(error);
          });
    });
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return new Observable((observer) => {
      this.getCoordsPickup(customer).subscribe((data: Customer) => {
        this.http.put<Customer>(this.apiUrl + "customers/" + data.id, data).subscribe((response) => {
          observer.next(response);
        })
      })
    })
  }

  public deleteCustomers(ids: number[]): Observable<any> {
    const company = this.usersService.getActiveCompany();
    return this.http.post(this.apiUrl + "customers/bulk-delete?company_id=" + company.id, { customers_id: ids });
  }

  private getCoordsPickup(customer: Customer): Observable<Customer> {
    let addressPickUp = `${customer.address} ${customer.zip} ${customer.city}`;
    return new Observable((observer) => {
      this.geocoder.geocode({ address: addressPickUp }, (results: GOOGLE_DATA, status: string) => {
        if (status === "OK") {
          let newCustomer = JSON.parse(JSON.stringify(customer));

          newCustomer.lat = results[0].geometry.location.lat();
          newCustomer.lon = results[0].geometry.location.lng();

          observer.next(newCustomer);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
          observer.error();
        }
      })
    })
  }
}
