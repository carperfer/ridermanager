import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects/';
import { of } from 'rxjs';
import { OrderActionTypes, loadOrdersSuccess, loadOrdersFailure, addOrderSuccess, addOrderFailure, updateOrderSuccess, updateOrderFailure, deleteOrdersSuccess, deleteOrdersFailure, updateStatusSuccess, updateStatusFailure, updateRiderSuccess, updateRiderFailure } from '../actions/order.actions'
import { catchError, map, mergeMap } from 'rxjs/operators';
import { OrdersService } from '../../services/orders/orders.service';

@Injectable()
export class OrderEffects {

    constructor(private actions$: Actions, private ordersService: OrdersService) { }

    loadOrders = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActionTypes.LoadOrders),
            mergeMap((action) => this.ordersService.getOrders(action['company_id'])
                .pipe(
                    map((orders) => {
                        return loadOrdersSuccess({ data: orders })
                    }),
                    catchError((error) => of(loadOrdersFailure(error)))
                )
            )
        )
    )

    addOrder = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActionTypes.AddOrder),
            mergeMap((action) => this.ordersService.addOrder(action['order'])
                .pipe(
                    map((orders) => {
                        return addOrderSuccess({ order: orders })
                    }),
                    catchError((error) => of(addOrderFailure(error)))
                )
            )
        )
    )

    updateOrder = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActionTypes.UpdateOrder),
            mergeMap((action) => this.ordersService.updateOrder(action['order'])
                .pipe(
                    map((order) => {
                        return updateOrderSuccess({ updatedOrder: order })
                    }),
                    catchError((error) => of(updateOrderFailure(error)))
                )
            )
        )
    )

    updateStatus = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActionTypes.UpdateStatus),
            mergeMap((action) => this.ordersService.setStatus(action['order_id'], action['newStatus'])
                .pipe(
                    map((order) => {
                        return updateStatusSuccess({ updatedOrder: order })
                    }),
                    catchError((error) => of(updateStatusFailure(error)))
                )
            )
        )
    )

    updateRider = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActionTypes.UpdateRider),
            mergeMap((action) => this.ordersService.assignRider(action['order_id'], action['driver_id'])
                .pipe(
                    map((order) => {
                        return updateRiderSuccess({ updatedOrder: order })
                    }),
                    catchError((error) => of(updateRiderFailure(error)))
                )
            )
        )
    )

    deleteOrders = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActionTypes.DeleteOrders),
            mergeMap((action) => this.ordersService.deleteOrders(action['ids'])
                .pipe(
                    map(() => {
                        return deleteOrdersSuccess({ ids: action['ids'] });
                    }),
                    catchError((error) => of(deleteOrdersFailure(error)))
                )
            )
        )
    )
}