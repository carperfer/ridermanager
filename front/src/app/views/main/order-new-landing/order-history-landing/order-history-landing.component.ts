import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/interfaces/drivers';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { Company } from 'src/app/interfaces/users';
import { DriversService } from 'src/app/services/drivers/drivers.service';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-order-history-landing',
  templateUrl: './order-history-landing.component.html',
  styleUrls: ['./order-history-landing.component.scss']
})
export class OrderHistoryLandingComponent implements OnInit {

  orders$: Subscription;
  orderStatus$: Subscription;
  drivers$: Subscription;

  orders: Order[];
  orderStatuses: OrderStatus[];
  drivers: Driver[];
  company: Company;
  externalId: string;

  loading: boolean = true;

  constructor(private ordersService: OrdersService, private route: ActivatedRoute, private driversService: DriversService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.externalId = this.route.parent?.snapshot.parent?.params.token;
    this.company = this.usersService.getActiveCompany();

    this.orders$ = this.ordersService.getOrdersByCustomerToken(this.externalId)
      .subscribe((orders: Order[]) => {
        this.orders = orders
      });

    this.orderStatus$ = this.ordersService.getAllStatus()
      .subscribe((orderStatuses: OrderStatus[]) => this.orderStatuses = orderStatuses);

    this.drivers$ = this.driversService.getDrivers(this.company.id).subscribe(drivers => {
      this.drivers = drivers;
      this.mapData();
    })

  }

  ngOnDestroy() {
    if (this.orders$) this.orders$.unsubscribe();
    if (this.orderStatus$) this.orderStatus$.unsubscribe();
    if (this.drivers$) this.drivers$.unsubscribe();
  }

  private mapData() {
    this.orders.forEach(order => {
      if (order.user_id) order.riderName = this.getRiderNameForTable(order.user_id);
    });
    this.loading = false;
  }

  private getRiderNameForTable(id: number | null) {
    //This function needs getRider to get assign driver and if there is a driver assigned calls getName to convert id (number) into name (string)
    if (!id) return;
    const driver = this.getRider(id);
    if (driver) return this.getName(driver);
  }

  private getRider(id: number | null) {
    if (!id) return;
    return this.drivers.filter(driver => driver.id == id)[0];
  }

  private getName(driver: Driver) {
    if (!driver) return;
    return driver.first_name;
  }

}
