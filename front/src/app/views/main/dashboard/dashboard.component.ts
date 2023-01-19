import { Component, OnInit } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { orderFilterParams } from 'src/app/pipes/orders.pipe';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { Driver, DriverSelect } from 'src/app/interfaces/drivers';
import { DashboardService } from './dashboard.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getRecentOrders } from 'src/app/store/selectors/order.selector';
import { Company } from 'src/app/interfaces/users';
import { UsersService } from 'src/app/services/users/users.service';
import { getDriverState, getDropdownDrivers } from 'src/app/store/selectors/driver.selector';
import { checkSelectedCompanyManageUsers } from 'src/app/store/selectors/selected-company.selector';
import { loadOrders } from 'src/app/store/actions/order.actions';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe, DashboardService]
})
export class DashboardComponent implements OnInit {

  orderStatuses$: Subscription;
  orders$: Observable<Order[]> = this.store.select(getRecentOrders);
  drivers$: Observable<Driver[]> = this.store.select(getDriverState);
  dropdownDrivers$: Observable<DriverSelect[]> = this.store.select(getDropdownDrivers);
  orderStatuses: OrderStatus[] = [];
  company: Company;

  filter: orderFilterParams = new orderFilterParams();
  dropdownDrivers: DriverSelect[] = [{
    value: 0,
    label: this.translate.instant("orders.filter_driver")
  }];
  selectedFilterStatus: number[] = [];
  selectedFilterDriver: number | null = null;

  isLoading: boolean = true;
  hideNewOrders: boolean = true;
  hideAssignedOrders: boolean = true;
  hideDrivers: boolean = true;
  showDrivers$: Observable<boolean> = this.store.select(checkSelectedCompanyManageUsers);

  constructor(public datepipe: DatePipe, private store: Store<AppState>, private translate: TranslateService, private dashboardService: DashboardService, private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.company = this.usersService.getActiveCompany();
    this.checkLastFilters();
    this.getRecentOrders();

    this.orderStatuses$ = this.dashboardService.getStatuses().subscribe(data => {
      this.orderStatuses = [...data];
      this.orderStatuses.forEach(status => status.dropdownName = this.translate.instant('status.' + status.id));
    });
  }

  ngOnDestroy() {
    if (this.orderStatuses$) this.orderStatuses$.unsubscribe();
  }

  private getRecentOrders() {
    let date = new Date();
    let today = formatDate(date, 'yyyy-MM-dd', 'en_US')
    let tomorrow = formatDate(date.setDate(date.getDate() + 1), 'yyyy-MM-dd', 'en_US');
    let shiftChangeHour = '06:00:00';

    this.store.dispatch(loadOrders({ company_id: `?pickup_after=${today} ${shiftChangeHour}&deliver_before=${tomorrow} ${shiftChangeHour}&company_id=${this.company.id}` }));
  }

  public filterByDriver() {
    localStorage.setItem('filterByDriver', JSON.stringify(this.selectedFilterDriver));
  }

  public filterByStatus() {
    localStorage.setItem('filterByStatus', JSON.stringify(this.selectedFilterStatus));
  }

  private checkLastFilters() {
    //Looks in localStorage and applies filters used in last connection
    const driverFilter = JSON.parse(localStorage.getItem('filterByDriver') || 'null');
    if (driverFilter) this.selectedFilterDriver = driverFilter;

    const statusFilter = <number[]>JSON.parse(localStorage.getItem('filterByStatus') || '[]');
    if (statusFilter) this.selectedFilterStatus = statusFilter;
  }

  public arrowToggle(cardDropdownVariable: string) {
    //Opens or closes orders/drivers column when size is tablet or mobile
    switch (cardDropdownVariable) {
      case 'new':
        this.hideNewOrders = !this.hideNewOrders;
        break;
      case 'assigned':
        this.hideAssignedOrders = !this.hideAssignedOrders;
        break;
      case 'drivers':
        this.hideDrivers = !this.hideDrivers
        break;
    }
  }
}

