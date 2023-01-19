import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { GoogleAddressComponent } from 'src/app/shared/google-address/google-address.component';
import { Order, OrderFromCustomer, OrderHistory, OrderStatus } from '../../interfaces/orders';

export enum OrderActionTypes {
  LoadOrders = '[Order] Load Orders',
  LoadOrdersSuccess = '[Order] Load Orders Success',
  LoadOrdersFailure = '[Order] Load Orders Failure',

  AddOrder = '[Order] Add Order',
  AddOrderSuccess = '[Order] Add Order Success',
  AddOrderFailure = '[Order] Add Order Failure',

  AddOrderFromRealtimeSuccess = '[Order] Add Order From Realtime Success',
  AddOrderFromRealtimeFailure = '[Order] Add Order From Realtime Failure',

  UpdateOrder = '[Order] Update Order',
  UpdateOrderSuccess = '[Order] Update Order Success',
  UpdateOrderFailure = '[Order] Update Order Failure',

  UpdateStatus = '[Order] Update Status',
  UpdateStatusSuccess = '[Order] Update Status Success',
  UpdateStatusFailure = '[Order] Update Status Failure',

  UpdateRider = '[Order] Update Rider',
  UpdateRiderSuccess = '[Order] Update Rider Success',
  UpdateRiderFailure = '[Order] Update Rider Failure',

  UpdateOrderFromRealtimeSuccess = '[Order] Update Order From Realtime Success',
  UpdateOrderFromRealtimeFailure = '[Order] Update Order From Realtime Success',

  DeleteOrders = '[Order] Delete Order',
  DeleteOrdersSuccess = '[Order] Delete Order Success',
  DeleteOrdersFailure = '[Order] Delete Order Failure',

  DeleteOrderFromRealtimeSuccess = '[Order] Delete Order From Realtime Success',
  DeleteOrderFromRealtimeFailure = '[Order] Delete Order From Realtime Success',
}


export const loadOrders = createAction(
  OrderActionTypes.LoadOrders,
  props<{ company_id: string }>()
);
export const loadOrdersSuccess = createAction(
  OrderActionTypes.LoadOrdersSuccess,
  props<{ data: Order[] }>()
);
export const loadOrdersFailure = createAction(
  OrderActionTypes.LoadOrdersFailure,
  props<{ error: any }>()
);


export const addOrder = createAction(
  OrderActionTypes.AddOrder,
  props<{ order: Order }>()
);
export const addOrderSuccess = createAction(
  OrderActionTypes.AddOrderSuccess,
  props<{ order: Order }>()
);
export const addOrderFailure = createAction(
  OrderActionTypes.AddOrderFailure,
  props<{ error: any }>()
);


export const updateOrder = createAction(
  OrderActionTypes.UpdateOrder,
  props<{ order: Order }>()
);
export const updateOrderSuccess = createAction(
  OrderActionTypes.UpdateOrderSuccess,
  props<{ updatedOrder: any }>()
);
export const updateOrderFailure = createAction(
  OrderActionTypes.UpdateOrderFailure,
  props<{ error: any }>()
);


export const updateStatus = createAction(
  OrderActionTypes.UpdateStatus,
  props<{ order_id: number, newStatus: OrderHistory }>()
);
export const updateStatusSuccess = createAction(
  OrderActionTypes.UpdateStatusSuccess,
  props<{ updatedOrder: any }>()
);
export const updateStatusFailure = createAction(
  OrderActionTypes.UpdateStatusFailure,
  props<{ error: any }>()
);

export const updateRider = createAction(
  OrderActionTypes.UpdateRider,
  props<{ order_id: number, driver_id: { user_id: number } }>()
);
export const updateRiderSuccess = createAction(
  OrderActionTypes.UpdateRiderSuccess,
  props<{ updatedOrder: any }>()
);
export const updateRiderFailure = createAction(
  OrderActionTypes.UpdateRiderFailure,
  props<{ error: any }>()
);


export const deleteOrders = createAction(
  OrderActionTypes.DeleteOrders,
  props<{ ids: number[] }>()
);
export const deleteOrdersSuccess = createAction(
  OrderActionTypes.DeleteOrdersSuccess,
  props<{ ids: number[] }>()
);
export const deleteOrdersFailure = createAction(
  OrderActionTypes.DeleteOrdersFailure,
  props<{ error: any }>()
);


export const addOrderFromRealtimeSuccess = createAction(
  OrderActionTypes.AddOrderFromRealtimeSuccess,
  props<{ order: any }>()
);
export const addOrderFromRealtimeFailure = createAction(
  OrderActionTypes.AddOrderFromRealtimeFailure,
  props<{ error: any }>()
);


export const updateOrderFromRealtimeSuccess = createAction(
  OrderActionTypes.UpdateOrderFromRealtimeSuccess,
  props<{ updatedOrder: Order }>()
);
export const updateOrderFromRealtimeFailure = createAction(
  OrderActionTypes.UpdateOrderFromRealtimeFailure,
  props<{ error: any }>()
);


export const deleteOrderFromRealtimeSuccess = createAction(
  OrderActionTypes.DeleteOrderFromRealtimeSuccess,
  props<{ id: number }>()
);
export const deleteOrderFromRealtimeFailure = createAction(
  OrderActionTypes.DeleteOrderFromRealtimeFailure,
  props<{ error: any }>()
);
