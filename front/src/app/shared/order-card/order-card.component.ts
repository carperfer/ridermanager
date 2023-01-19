import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/interfaces/drivers';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { UsersService } from 'src/app/services/users/users.service';
import { updateStatus, updateStatusSuccess } from 'src/app/store/actions/order.actions';
import { AppState } from 'src/app/store/reducers';
import { AssignNearbyDriversComponent } from '../assign-nearby-drivers/assign-nearby-drivers.component';
import { OrderEditDialogComponent } from '../order-edit-dialog/order-edit-dialog.component';
import { OrderHistoryComponent } from '../order-history/order-history.component';
import { OrderCancelDialogComponent } from "../order-cancel-dialog/order-cancel-dialog.component";

@Component({
    selector: 'app-order-card',
    templateUrl: './order-card.component.html',
    styleUrls: ['./order-card.component.scss'],
    providers: [DialogService]
})
export class OrderCardComponent implements OnInit, OnChanges, OnDestroy {

    @HostListener('document:click', ['$event']) onDocumentClick() {
        //Closes listBox if clicking outside
        if (this.showListbox) this.showListbox = false;
    }

    @Input() order!: Order;
    @Input() orderStatuses: OrderStatus[] = [];
    @Input() drivers!: Driver[];

    listboxOrderStatuses: OrderStatus[] = [];
    driver: Driver;
    updateStatus$: Subscription

    showOrderHistory: boolean = false;
    showEditBtn: boolean = false;
    showListbox: boolean = false;
    allowEdit: boolean = true;

    public color: string;

    constructor(private translate: TranslateService, private usersService: UsersService, private dialogService: DialogService, private store: Store<AppState>, private _actions$: Actions) {
    }

    ngOnInit() {
        this.showOrderHistory = this.usersService.checkPermission('see-history');
        this.showEditBtn = this.usersService.checkPermission('edit-orders');

        this.listboxOrderStatuses = [...this.orderStatuses];
        this.listboxOrderStatuses.shift()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.orderStatuses?.currentValue.length) this.color = this.getStatusColor(this.order.status_id);
        if (this.order.user_id) this.driver = this.drivers.filter(driver => driver.id === this.order.user_id)[0];
        if (this.listboxOrderStatuses.length > 6 || !this.listboxOrderStatuses.length) {
            this.listboxOrderStatuses = [...this.orderStatuses];
            this.listboxOrderStatuses.shift();
        }
        this.allowEdit = this.getStatusName(this.order.status_id) !== 'canceled';

        this.updateStatus$ = this._actions$.pipe(ofType(updateStatusSuccess)).subscribe(() => {
            this.driver = this.drivers.filter(driver => driver.id === this.order.user_id)[0];
        });
    }

    ngOnDestroy() {
        if (this.updateStatus$) this.updateStatus$.unsubscribe();
    }

    private getStatusColor(id: number | null) {
        return this.orderStatuses.filter(status => status.id === id)[0]?.name;
    }

    public getStatusName(statusid: number): string {
        let search = this.orderStatuses.find(status => status.id === statusid);
        return search ? search.name : "";
    }

    public toggleListbox(event: Event) {
        event.stopPropagation();
        this.showListbox = !this.showListbox;
    }

    public closeListbox() {
        this.showListbox = false;
    }

    public changeStatus(status: OrderStatus) {
        if (status.name === 'canceled') {
            this.askForComment(this.order, status);
        } else {
            this.store.dispatch(updateStatus({ order_id: this.order.id, newStatus: { order_id: this.order.id, status_id: status.id, comments: '' } }));
        }
    }

    public openOrderEditDialog(order: Order) {
        if (this.showEditBtn) {
            this.dialogService.open(OrderEditDialogComponent, {
                data: {
                    order: { ...order }
                },
                header: this.translate.instant('orders.edit_order'),
                width: '75%'
            });
        }
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
        if (this.showEditBtn) {
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

    public stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
