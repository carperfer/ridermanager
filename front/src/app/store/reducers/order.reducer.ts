import { createReducer, on } from '@ngrx/store';
import * as OrderActions from '../actions/order.actions';
import { Order } from '../../interfaces/orders';


export const initialOrdersState: Order[] = [];
const _orderReducer =
  createReducer(
    initialOrdersState,
    on(OrderActions.loadOrdersSuccess, (state, { data }) => data),
    on(OrderActions.addOrderFromRealtimeSuccess, (state, { order }) => {
      if (state.some(existingOrder => existingOrder.id === order.id)) return state
      else return [...JSON.parse(JSON.stringify(state)), order];
    }),
    on(OrderActions.updateOrderFromRealtimeSuccess, (state, { updatedOrder }) => {
      return state.map(order => {
        if (order.id === updatedOrder.id) {
          return {
            ...updatedOrder
          }
        }
        else {
          return order
        }
      });
    }),
    on(OrderActions.updateStatusSuccess, (state, { updatedOrder }) => {
      return state.map(order => {
        if (order.id === updatedOrder.id) {
          return {
            ...updatedOrder
          }
        }
        else {
          return order
        }
      });
    }),
    on(OrderActions.updateRiderSuccess, (state, { updatedOrder }) => {
      return state.map(order => {
        if (order.id === updatedOrder.id) {
          return {
            ...updatedOrder
          }
        }
        else {
          return order
        }
      });
    }),
    on(OrderActions.deleteOrderFromRealtimeSuccess, (state, { id }) => {
      return [...state.filter(order => order.id != id)]
    }),
  )
export function orderReducer(state: any, action: any) {
  return _orderReducer(state, action);
}
