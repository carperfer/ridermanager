import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../interfaces/orders';

@Pipe({ name: 'isAssigned' })
export class isAssigned implements PipeTransform {
  transform(value: Order[], assigned: boolean = true): Order[] {
    if (!assigned) {
      return value.filter(order => order.user_id === null);
    }
    return value.filter(order => order.user_id !== null);
  }
}

@Pipe({ name: 'orderFilter' })
export class orderFilter implements PipeTransform {
  transform(value: Order[], filter: { driver: number | null, status: number[] }): Order[] {

    let orders = value;
    if (filter.driver !== null) {
      orders = orders.filter((order: Order) => order.user_id === filter.driver);
    }

    if (filter.status.length) {
      orders = orders.filter((order: Order) => {
        let passFilter = false;
        filter.status.forEach(statusId => {
          if (order.status_id === statusId) passFilter = true;
        })
        return passFilter;
      });
    }
    return orders;
  }
}
export class orderFilterParams {
  constructor(public driver: string = "", public status: string = "", public sort: string = "-1", public text: string | Event = '') { }
}
