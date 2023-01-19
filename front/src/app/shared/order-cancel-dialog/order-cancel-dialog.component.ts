import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { updateStatus, updateStatusSuccess } from 'src/app/store/actions/order.actions';
import { AppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';

@Component({
  selector: 'app-order-cancel-dialog',
  templateUrl: './order-cancel-dialog.component.html',
  styleUrls: ['./order-cancel-dialog.component.scss'],
})

export class OrderCancelDialogComponent implements OnInit {

  cancelOrderForm: FormGroup;
  order: Order;
  status: OrderStatus;
  order$: Subscription;
  cancelOrderSuccess$: Subscription;

  constructor(public config: DynamicDialogConfig, private ordersService: OrdersService, private store: Store<AppState>, private _actions$: Actions, private fb: FormBuilder, public dialog: DynamicDialogRef, private message: ShowMessageService) {
    this.status = this.config.data.status;
    this.cancelOrderForm = this.fb.group({
      comments: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.order$ = this.ordersService.getOrderById(this.config.data.order.id).subscribe({
      next: order => {
        this.order = order;
      }
    });

    this.cancelOrderSuccess$ = this._actions$.pipe(ofType(updateStatusSuccess)).subscribe(() => {
      this.dialog.close();
      this.message.showMessage('success', 'orders.success', 'orders.order_updated');
    });
  }

  ngOnDestroy() {
    if (this.order$) this.order$.unsubscribe();
    if (this.cancelOrderSuccess$) this.cancelOrderSuccess$.unsubscribe();
  }

  public cancelOrder() {
    this.cancelOrderForm.markAllAsTouched();

    if (this.cancelOrderForm.invalid) {
      Object.keys(this.cancelOrderForm.controls).forEach(key => {
        this.cancelOrderForm.get(key)?.markAsDirty();
      });

      this.message.showMessage('error', 'orders.error', 'orders.requiredError');
      return '';
    }

    this.store.dispatch(updateStatus({ order_id: this.order.id, newStatus: { order_id: this.order.id, status_id: this.status.id, comments: this.cancelOrderForm.value.comments } }));
  }


}
