import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Order, OrderStatus, OrderHistory, OrderFromCustomer, PaymentType } from '../../interfaces/orders';
import { environment } from "../../../environments/environment";
import { UsersService } from '../users/users.service';
@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  private apiUrl = environment.apiUrl;
  private STATUS_COLORS: string[];
  private geocoder: any;

  constructor(private http: HttpClient, private usersService: UsersService) {
    this.STATUS_COLORS = [
      "in-queue",
      "accepted",
      "picking-up",
      "delivering",
      "completed",
      "canceled",
      "troubled"
    ];
    this.geocoder = new google.maps.Geocoder();
  }

  public getOrders(query: string = ""): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + "orders" + query);
  }

  public getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(this.apiUrl + "orders/" + id);
  }

  public getOrdersByCustomerToken(token_id: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + 'customers/' + token_id + '/orders');
  }

  public addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl + "orders", order);
  }

  public createOrderFromCustomer(order: OrderFromCustomer): Observable<any> {
    return this.http.post(this.apiUrl + "orders/customer", order);
  }

  public updateOrder(order: Order): Observable<any> {
    return this.http.put<Order>(this.apiUrl + "orders/" + order.id, order);
  }

  public deleteOrders(ids: number[]): Observable<any> {
    const company = this.usersService.getActiveCompany();
    return this.http.post(this.apiUrl + "orders/bulk-delete?company_id=" + company.id, { orders_id: ids });
  }

  public assignRider(orderid: number, driver_id: { user_id: number }) {
    return this.http.post(this.apiUrl + "orders/" + orderid + "/assign", driver_id);
  }

  public setStatus(orderid: number, newStatus: OrderHistory) {
    return this.http.post(this.apiUrl + "orders/" + orderid + "/status", newStatus);
  }

  public getAllStatus(): Observable<OrderStatus[]> {
    return this.http.get<OrderStatus[]>(this.apiUrl + "statuses");
  }

  public getAllPaymentTypes(): Observable<PaymentType[]> {
    return this.http.get<PaymentType[]>(this.apiUrl + 'payment-types');
  }

  public getStatusColor(id: number | null) {
    if (id != null) {
      return this.STATUS_COLORS[id - 1];
    }
  }

}
