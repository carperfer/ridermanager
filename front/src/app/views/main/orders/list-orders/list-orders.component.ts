import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Driver } from 'src/app/interfaces/drivers';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OrderEditDialogComponent } from 'src/app/shared/order-edit-dialog/order-edit-dialog.component';

import { UsersService } from 'src/app/services/users/users.service';
import { Store } from '@ngrx/store';
import { deleteOrders, deleteOrdersSuccess, loadOrders, updateStatus } from 'src/app/store/actions/order.actions';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/store/reducers';
import { Company } from 'src/app/interfaces/users';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { OrderCancelDialogComponent } from 'src/app/shared/order-cancel-dialog/order-cancel-dialog.component';
import { OrderHistoryComponent } from 'src/app/shared/order-history/order-history.component';
import { AssignNearbyDriversComponent } from 'src/app/shared/assign-nearby-drivers/assign-nearby-drivers.component';



@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss'],
  providers: [DialogService]
})
export class ListOrdersComponent implements OnInit, OnDestroy {

  @ViewChild('table') table: Table;

  store$: Subscription;
  orderStatuses$: Subscription;
  deleteOrders$: Subscription;

  orders: Order[] = [];
  drivers: Driver[] = [];
  driver: Driver;
  company: Company;
  selectedOrders: Order[] = [];
  orderStatuses: OrderStatus[] = [];

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.closeAllStatusListboxes(this.orders);
  }

  updateActive: boolean = false;
  loading: boolean = true;
  canEdit: boolean = false;
  canDelete: boolean = false;
  showOrderHistory: boolean = false;

  public color: string;


  constructor(private ordersService: OrdersService, private translate: TranslateService, private confirmationService: ConfirmationService, private usersService: UsersService, private dialogService: DialogService, private store: Store<AppState>, private _actions$: Actions, private message: ShowMessageService) {
  }

  ngOnInit() {
    this.showOrderHistory = this.usersService.checkPermission('see-history');
    this.company = this.usersService.getActiveCompany();
    this.store.dispatch(loadOrders({ company_id: `?company_id=${this.company.id}` }));

    this.store$ = this.store.subscribe(store => {
      this.drivers = store.drivers;
      this.orders = store.orders;
      if (this.orderStatuses.length) {
        this.mapData();
      }
    });

    this.orderStatuses$ = this.ordersService.getAllStatus().subscribe({
      next: statuses => {
        this.orderStatuses = statuses;
        this.mapData();
      }
    });

    this.canEdit = this.usersService.checkPermission('edit-orders');
    this.canDelete = this.usersService.checkPermission('remove-orders');
  }

  ngOnDestroy() {
    if (this.store$) this.store$.unsubscribe();
    if (this.orderStatuses$) this.orderStatuses$.unsubscribe();
    if (this.deleteOrders$) this.deleteOrders$.unsubscribe();
  }

  private closeAllStatusListboxes(orders: Order[]) {
    this.orders = orders;
    this.orders.forEach(order => {
      order.showStatuses = false;
    });
  }

  private mapData() {
    this.orders.forEach(order => {
      order.pickup_at = new Date(order.pickup_at);
      order.deliver_at = new Date(order.deliver_at);
      order.isCanceled = this.getStatusName(order.status_id) === 'canceled';
      order.showStatuses = false;
      if (order.user_id) order.riderName = this.getRiderNameForTable(order.user_id);
    });
    this.loading = false;
  }

  public changeStatus(order: Order, status: OrderStatus) {
    if (status.name === 'canceled') {
      this.askForComment(order, status);
    } else {
      this.store.dispatch(updateStatus({ order_id: order.id, newStatus: { order_id: order.id, status_id: status.id, comments: '' } }));
    }
  }

  public toggleListbox(event: Event, order: Order) {
    event.stopPropagation();
    this.orders.forEach(order => {
      order.showStatuses = false;
      if (order.user_id) order.riderName = this.getRiderNameForTable(order.user_id);
    });
    order.showStatuses = !order.showStatuses;
  }

  public openOrderEditDialog(order: Order) {
    this.dialogService.open(OrderEditDialogComponent, {
      data: {
        order: { ...order }
      },
      header: this.translate.instant('orders.edit_order'),
      width: '75%'
    });
  }

  public deleteSelectedOrdersConfirmation() {
    //Decides which message to show depending on number of selected orders
    this.selectedOrders.length > 1 ?
      this.showDeleteConfirmationMessage('orders.multiple_delete_text') :
      this.showDeleteConfirmationMessage('orders.delete_text');
  }

  private showDeleteConfirmationMessage(translationText: string) {
    //Asks to confirm the deleting of selected orders
    this.confirmationService.confirm({
      message: this.translate.instant(translationText),
      header: this.translate.instant('delete.delete_title'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.sendDeleteOrdersId() }
    });
  }

  private sendDeleteOrdersId() {
    //Deletes the selected orders
    let ids: number[] = [];
    this.selectedOrders.forEach(order => ids.push(order.id));
    this.store.dispatch(deleteOrders({ ids: ids }));

    this.deleteOrders$ = this._actions$.pipe(ofType(deleteOrdersSuccess)).subscribe(() => {
      ids.length > 1 ?
        this.message.showMessage('success', 'drivers.invitation_delete_title', 'orders.multiple_delete_success') :
        this.message.showMessage('success', 'drivers.invitation_delete_title', 'orders.delete_success');
    });

    this.selectedOrders = [];
  }

  private getRiderNameForTable(id: number | null) {
    /*This function needs getRider to get assign driver and if there is a driver assigned calls getName to convert id
    (number) into name (string)*/
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
    return driver.first_name + ' ' + driver.last_name;
  }

  private askForComment(order: Order, status: OrderStatus) {
    this.dialogService.open(OrderCancelDialogComponent, {
      data: {
        order: order,
        status: status,
      },
      header: this.translate.instant('orders.cancel_order'),
      width: '70%'
    });
  }

  public getStatusName(statusid: number): string {
    let search = this.orderStatuses.find(status => status.id === statusid);
    return search ? search.name : "";
  }

  public openOrderHistoryDialog(order: Order) {
    if (this.showOrderHistory) {
      this.dialogService.open(OrderHistoryComponent, {
        data: {
          order: order,
          orderStatuses: this.orderStatuses
        },
        header: this.translate.instant('orders.history'),
        width: '70%'
      });
    }
  }

  public openAssignNearbyDrivers(order: Order) {
    if (this.canEdit) {
      this.dialogService.open(AssignNearbyDriversComponent, {
        data: {
          order: order,
          drivers: this.drivers
        },
        header: this.translate.instant('orders.nearby_drivers'),
        width: '70%'
      });
    }
  }

}
