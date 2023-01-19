import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { OrderStatus } from 'src/app/interfaces/orders';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private ordersService: OrdersService) { }

  getStatuses(): Observable<OrderStatus[]> {
    return this.ordersService.getAllStatus();
  }
}
