import { Component, Input, OnInit } from '@angular/core';
import { Driver } from 'src/app/interfaces/drivers';

@Component({
  selector: 'app-chip-rider',
  templateUrl: './chip-rider.component.html',
  styleUrls: ['./chip-rider.component.scss']
})
export class ChipRiderComponent implements OnInit {

  @Input() driver!: Driver;

  constructor() { }

  ngOnInit(): void {
  }



}
