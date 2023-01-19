import { formatDate } from "@angular/common";
import { createFeatureSelector, createSelector, } from "@ngrx/store";
import { Order } from "src/app/interfaces/orders";

export const getOrderState = createFeatureSelector<Order[]>('orders');
export const getRecentOrders = createSelector(
    getOrderState,
    (orders: Order[]) => {

        let date = new Date();
        let today = formatDate(new Date(), 'yyyy-MM-dd 06:00:00', 'en_US')
        let tomorrow = formatDate(date.setDate(date.getDate() + 1), 'yyyy-MM-dd 06:00:00', 'en_US');

        return orders.filter((order: Order) =>
            formatDate(order.pickup_at, 'yyyy-MM-dd HH:mm:ss', 'en_US') > today &&
            formatDate(order.pickup_at, 'yyyy-MM-dd HH:mm:ss', 'en_US') < tomorrow)
    }
)

