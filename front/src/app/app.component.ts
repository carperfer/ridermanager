import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ShowMessageService } from "./services/show-message/show-message.service";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService, private updates: SwUpdate, private router: Router, private message: ShowMessageService, private messageService: MessageService) {
    this.translate.setDefaultLang('es');
    updates.available.subscribe((event) => {
      updates.activateUpdate().then(() => {
        document.location.reload()
        localStorage.clear()
        this.router.navigate(['/login'])
      });
      this.messageService.add({
        severity: 'info',
        summary: `¡Hay una nueva versión disponible!`,
        detail: 'Vuelve a iniciar sesión para disfrutar de las novedades de RiderManager.',
        sticky: true,
        life: 5000
      });
    })
  }

  public ngOnInit(): void {
    this.updates.checkForUpdate();

    this.updates.available.subscribe(event => {
      this.updates.activateUpdate().then(() => this.updateApp());
    })
  }

  private updateApp() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.message.showMessage('info', 'auth.update_title', 'auth.update_msg')
  }
}
