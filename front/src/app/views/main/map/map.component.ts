import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { Order, OrderStatus } from 'src/app/interfaces/orders';
import { Company } from 'src/app/interfaces/users';
import { Driver } from 'src/app/interfaces/drivers';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getRecentOrders } from 'src/app/store/selectors/order.selector';
import { formatDate } from '@angular/common';
import { loadOrders } from 'src/app/store/actions/order.actions';
import { UsersService } from 'src/app/services/users/users.service';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    //Detects clicks in DOM except for the icons in order to close the infoWindow when clicking outside
    let eventTarget = event.target as HTMLInputElement;
    if (eventTarget.localName != 'img') {
      this.mapInfo.forEach(mapinfo => this.closeInfo(mapinfo));
    }
  }

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  config: google.maps.MapOptions = {
    zoom: 14,
    styles: [{
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }],
    }],
  }

  orderStatuses$: Subscription;
  store$: Subscription;
  recentOrders$: Subscription;

  company: Company;
  orders: Order[] = [];
  drivers: Driver[] = [];
  orderStatuses: OrderStatus[] = [];
  pickupMessage: string;
  mapInfo: MapInfoWindow[] = [];

  ordersMarkers: any[] = [];
  driversMarkers: any[] = [];

  driversEnabled: boolean = true;
  ordersEnabled: boolean = true;

  constructor(private store: Store<AppState>, private usersService: UsersService, private ordersService: OrdersService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.company = this.usersService.getActiveCompany();
    this.getRecentOrders();

    this.recentOrders$ = this.store.pipe(select(getRecentOrders)).subscribe(recentOrders => {

      this.orders = recentOrders || [];
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.config.center = { lat: position.coords.latitude, lng: position.coords.longitude }
        })
      }
      this.refreshMap();
    });

    this.store$ = this.store.subscribe(state => {
      this.drivers = [...JSON.parse(JSON.stringify(state.drivers))];
      this.refreshMap();
    });

    this.orderStatuses$ = this.ordersService.getAllStatus().subscribe(data => {
      this.orderStatuses = [...data];
    });
  }

  ngOnDestroy() {
    if (this.recentOrders$) this.recentOrders$.unsubscribe();
    if (this.store$) this.store$.unsubscribe();
    if (this.orderStatuses$) this.orderStatuses$.unsubscribe();
  }

  private getRecentOrders() {
    let date = new Date();
    let today = formatDate(date, 'yyyy-MM-dd', 'en_US')
    let tomorrow = formatDate(date.setDate(date.getDate() + 1), 'yyyy-MM-dd', 'en_US');
    let shiftChangeHour = '06:00:00';

    this.store.dispatch(loadOrders({ company_id: `?pickup_after=${today} ${shiftChangeHour}&deliver_before=${tomorrow} ${shiftChangeHour}&company_id=${this.company.id}` }));
  }

  private refreshMap() {
    this.ordersMarkers = [];
    this.driversMarkers = [];
    this.createOrdersMarkers();
    this.createDriversMarkers();
  }

  private createOrdersMarkers() {
    if (this.ordersEnabled) {
      this.orders.forEach(order => {
        let pickupMessage = this.getPickupMessage(order);
        let mark = {
          order: order,
          message: pickupMessage,
          properties: new google.maps.Marker(
            {
              position: {
                lat: order.pickup_info.lat,
                lng: order.pickup_info.lon,
              },
              title: order.pickup_info.name,
            }),
          options: {
            icon: {
              url: 'assets/icons/radio_button_checked.png',
              scaledSize: new google.maps.Size(40, 40),
              labelOrigin: new google.maps.Point(0, 0)
            }
          }
        }
        this.ordersMarkers.push(mark);
      });

      this.orders.forEach(order => {
        let mark = {
          order: order,
          message: '',
          properties: new google.maps.Marker(
            {
              position: {
                lat: order.delivery_info.lat,
                lng: order.delivery_info.lon,
              },
              title: order.delivery_info.name
            }),
          options: {
            icon: {
              url: 'assets/icons/place.png',
              scaledSize: new google.maps.Size(30, 30),
              labelOrigin: new google.maps.Point(0, 0)
            }
          }
        }
        this.ordersMarkers.push(mark);
      });
    }
    this.createDriversMarkers();
  }

  private createDriversMarkers() {
    this.drivers.forEach(driver => {
      if (driver.online) {
        let mark = {
          driver: driver,
          properties: new google.maps.Marker(
            {
              position: {
                lat: driver.location.lat,
                lng: driver.location.lon,
              },
              title: driver.first_name,
            }),
          options: {
            icon: {
              url: 'assets/icons/bike.png',
              scaledSize: new google.maps.Size(30, 30),
              labelOrigin: new google.maps.Point(0, 0)
            }
          }
        }
        this.driversMarkers.push(mark);
      }
    });
  }

  public openInfo(marker: any, infoDialog: MapInfoWindow, markerInfo: any) {
    infoDialog.open(marker);
    this.mapInfo.push(infoDialog);

    // this.ordersMarkers = this.ordersMarkers.map((mark) => {
    //   if (mark.order.id === markerInfo.order.id) {
    //     let options = mark.options;
    //     options.icon.url = 'assets/icons/bike.png';
    //     return { ...mark, options }
    //   } else {
    //     return mark;
    //   }
    // });
  }

  private closeInfo(infoDialog: MapInfoWindow) {
    infoDialog.close()
  }

  private getPickupMessage(order: Order) {
    //Shows in pick-up markers only how many orders are assigned to this customer (only shows number of how many)
    const totalOrders = this.orders.filter(orderToCompare => order.pickup_info.lat === orderToCompare.pickup_info.lat && order.pickup_info.lon === orderToCompare.pickup_info.lon);

    return totalOrders.length === 1 ?
      `${this.translate.instant('map.you_have')} ${totalOrders.length} ${this.translate.instant('map.order')}` :
      `${this.translate.instant('map.you_have')} ${totalOrders.length} ${this.translate.instant('map.orders')}`;
  }

  public stopPropagation(event: Event) {
    event.stopPropagation();
  }

}