import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/interfaces/orders';

@Component({
  selector: 'app-chip-amount',
  templateUrl: './chip-amount.component.html',
  styleUrls: ['./chip-amount.component.scss']
})
export class ChipAmountComponent implements OnInit {

  @Input() order: Order;

  constructor() { }

  ngOnInit(): void {
  }

}
