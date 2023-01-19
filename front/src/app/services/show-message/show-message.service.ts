import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ShowMessageService {

  constructor(private messageService: MessageService, private translate: TranslateService) { }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: severity,
      summary: this.translate.instant(summary),
      detail: this.translate.instant(detail),
    });
  }
}
