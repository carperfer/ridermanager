import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {

  constructor(private messageService: MessageService, private translate: TranslateService) { }

  showError(messageError: string, dynamicInfo?: string) {
    this.messageService.clear();
    this.messageService.add({
      severity: 'warn',
      summary: `Error:`,
      detail: this.translate.instant('error.' + messageError) + dynamicInfo,
      life: 5000
    });
  }
}
