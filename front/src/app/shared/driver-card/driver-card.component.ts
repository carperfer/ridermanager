import { Component, Input, OnInit } from '@angular/core';
import { Driver } from 'src/app/interfaces/drivers';
import { DriversService } from 'src/app/services/drivers/drivers.service';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss']
})
export class DriverCardComponent implements OnInit {

  @Input() driver!: Driver;
  @Input() editEnable: boolean = false;

  constructor(private driversService: DriversService) {
  }

  ngOnInit(): void {
  }

  public getStatusColor(id: number) {
    return this.driversService.getStatusColor(id);
  }

  public stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
