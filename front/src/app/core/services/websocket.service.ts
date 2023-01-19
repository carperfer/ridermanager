import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
export const WS_ENDPOINT = environment.wsUrl;
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor(private socket: Socket) { }

  sendMessage(msg: any) {
    this.socket.emit('msg', msg);
  }

  getMessage(channel: string) {
    return this.socket.fromEvent(channel).pipe(map((data: any) => data));
  }

  removeAllListeners() {
    this.socket.removeAllListeners();
  }
}
