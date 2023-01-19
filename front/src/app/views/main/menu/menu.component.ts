import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { Company } from 'src/app/interfaces/users';
import { UsersService } from 'src/app/services/users/users.service';
import { loadCompanies } from 'src/app/store/actions/company.actions';
import { loadCustomers } from 'src/app/store/actions/customer.actions';
import { addDriversFromRealtimeSuccess, deleteDriverFromRealtimeSuccess, loadDrivers, updateDriversFromRealtimeSuccess } from 'src/app/store/actions/driver.actions';
import { addOrderFromRealtimeSuccess, loadOrders, loadOrdersSuccess, updateOrderFromRealtimeSuccess, deleteOrderFromRealtimeSuccess } from 'src/app/store/actions/order.actions';
import { setSelectedCompany } from 'src/app/store/actions/selected-company.actions';
import { AppState } from 'src/app/store/reducers';
import { getCompanies } from 'src/app/store/selectors/company.selector';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  allCompanies: Company[];
  selectedCompany: Company;
  wsChannel: number = 1;

  getCompanies$: Subscription;
  loadOrders$: Subscription;
  ordersws$: Subscription;
  usersws$: Subscription;

  navOpened: boolean = false;
  public showSidebar: boolean = false;
  showRidersSection: boolean = false;
  showCustomersSection: boolean = false;
  showCreateOrderBtn: boolean = false;
  loading: boolean = false;



  constructor(private usersService: UsersService, private store: Store<AppState>, private webSocketService: WebsocketService, private _actions$: Actions) {
  }

  ngOnInit() {
    this.store.dispatch(loadCompanies());
    this.getCompanies$ = this.store.select(getCompanies).pipe(filter((companies) => !!companies.length
    )).subscribe(companies => {
      this.allCompanies = companies;

      this.getSelectedCompany();
      this.checkPermissions();

      this.store.dispatch(loadCustomers({ company_id: this.selectedCompany?.id }));
      this.store.dispatch(loadDrivers({ company_id: this.selectedCompany?.id }));

      this.wsChannel = this.selectedCompany?.id;
      this.listenWebSocket();
    });

    this.loadOrders$ = this._actions$.pipe(ofType(loadOrdersSuccess)).subscribe(() => {
      this.loading = false;
    });
  }


  ngOnDestroy() {
    if (this.getCompanies$) this.getCompanies$.unsubscribe();
    if (this.loadOrders$) this.loadOrders$.unsubscribe();
    if (this.ordersws$) this.ordersws$.unsubscribe();
    if (this.usersws$) this.usersws$.unsubscribe();
  }

  private listenWebSocket() {

    this.ordersws$ = this.webSocketService.getMessage(`orders:${this.wsChannel}`).subscribe((mgs) => {
      switch (mgs.action) {
        case 'CREATE':
          this.store.dispatch(addOrderFromRealtimeSuccess({ order: mgs.model }));
          break;
        case 'UPDATE':
          this.store.dispatch(updateOrderFromRealtimeSuccess({ updatedOrder: mgs.model }));
          break;
        case 'DELETE':
          this.store.dispatch(deleteOrderFromRealtimeSuccess({ id: mgs.model.id }));
          break;
      }
    });

    this.usersws$ = this.webSocketService.getMessage(`users:${this.wsChannel}`).subscribe((mgs) => {
      switch (mgs.action) {
        case 'CREATE':
          this.store.dispatch(addDriversFromRealtimeSuccess({ driver: mgs.model }));
          break;
        case 'UPDATE':
          this.store.dispatch(updateDriversFromRealtimeSuccess({ updatedDriver: mgs.model }));
          break;
        case 'DELETE':
          this.store.dispatch(deleteDriverFromRealtimeSuccess({ id: mgs.model.id }))
          break;
      }
    });
  }

  public setCompany() {
    this.loading = true;
    localStorage.setItem('company', JSON.stringify(this.selectedCompany));
    this.store.dispatch(setSelectedCompany({ selectedCompany: this.selectedCompany }));
    this.checkPermissions();

    this.wsChannel = this.selectedCompany.id;
    this.store.dispatch(loadCustomers({ company_id: this.selectedCompany.id }));
    this.store.dispatch(loadDrivers({ company_id: this.selectedCompany.id }));
    this.store.dispatch(loadOrders({ company_id: `?company_id=${this.selectedCompany.id}` }));
    this.listenWebSocket();
  }

  public toggleNav(): void {
    this.showSidebar = !this.showSidebar;
  }

  private getSelectedCompany() {
    const company = JSON.parse(localStorage.getItem('company') || 'null');
    this.selectedCompany = company ?
      this.allCompanies.filter(arrayCompany => arrayCompany.id === company.id)[0] :
      this.allCompanies[0];
    this.store.dispatch(setSelectedCompany({ selectedCompany: this.selectedCompany }));
  }

  private checkPermissions() {
    this.showRidersSection =
      this.usersService.checkPermission('manage-users') || this.usersService.checkPermission('manage-invites');
    this.showCustomersSection = this.usersService.checkPermission('manage-customers');
    this.showCreateOrderBtn = this.usersService.checkPermission('create-orders');
  }

}
