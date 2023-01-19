import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { OrderStatus } from 'src/app/interfaces/orders';

@Component({
  selector: 'app-chip-status',
  templateUrl: './chip-status.component.html',
  styleUrls: ['./chip-status.component.scss']
})
export class ChipStatusComponent implements OnInit {

  @Input() statusId: number | null;
  @Input() orderStatuses: OrderStatus[]
  color: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderStatuses?.currentValue?.length) {
      this.color = this.getStatusColor(this.statusId);
    }
  }

  getStatusColor(id: number | null) {
    return this.orderStatuses.filter(status => status.id === id)[0]?.name;
  }

}
