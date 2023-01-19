import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-new-landing',
  templateUrl: './order-new-landing.component.html',
  styleUrls: ['./order-new-landing.component.scss']
})
export class OrderNewLandingComponent implements OnInit, OnDestroy {

  items: MenuItem[];
  activeItem: MenuItem;
  token$: Subscription;
  externalId: string;

  constructor(private translate: TranslateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.token$ = this.route.params.subscribe(param => this.externalId = param.token || '');
    this.items = [
      { label: this.translate.instant('orders.new_order'), routerLink: ['/customer/' + this.externalId + '/form'] },
      { label: this.translate.instant('orders.order_history'), routerLink: ['/customer/' + this.externalId + '/history'] }
    ];
    this.activeItem = this.items[0];
  }

  ngOnDestroy() {
    if (this.token$) this.token$.unsubscribe();
  }

}
