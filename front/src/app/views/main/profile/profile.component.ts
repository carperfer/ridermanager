import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CompanyNewDialogComponent } from './company-new-dialog/company-new-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DialogService]
})
export class ProfileComponent implements OnInit {

  items: MenuItem[];
  activeItem: MenuItem;

  constructor(private translate: TranslateService, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.items = [
      { label: this.translate.instant('users.User'), routerLink: ['user'] },
      { label: this.translate.instant('users.Company'), routerLink: ['company'] }
    ];
    this.activeItem = this.items[0];
  }

  public openNewCompanyDialog() {
    this.dialogService.open(CompanyNewDialogComponent, {
      header: this.translate.instant('profile.create_company'),
      width: '50%'
    });
  }

}
