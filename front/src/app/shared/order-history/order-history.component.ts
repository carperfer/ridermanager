import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { OrdersService } from 'src/app/services/orders/orders.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})

export class OrderHistoryComponent implements OnInit, OnDestroy {

  order$: Subscription;
  order: Order;
  stepsStatuses: MenuItem[];
  activeIndex: number;
  isCanceled: boolean;

  constructor(public config: DynamicDialogConfig, private translate: TranslateService, private ordersService: OrdersService) {
    this.isCanceled = false;

    this.stepsStatuses = [];
    this.config.data.orderStatuses.forEach((status: OrderStatus) => {
      if (status.sort >= 0) this.stepsStatuses.push({ label: this.translate.instant(`status.${status.id}`) })
    })
  }

  ngOnInit(): void {
    this.order$ = this.ordersService.getOrderById(this.config.data.order.id).subscribe({
      next: order => {
        this.order = order;
        this.order.history.reverse();
        this.activeIndex = this.order.history[0].status_id || 0;
        if (this.activeIndex > 0 && this.activeIndex <= 5) this.activeIndex -= 1;
        else this.isCanceled = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.order$) this.order$.unsubscribe();
  }


}
