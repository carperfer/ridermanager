import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomerEditDialogComponent } from 'src/app/views/main/customers/customer-edit-dialog/customer-edit-dialog.component';
import { Customer } from 'src/app/interfaces/customers';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsersService } from 'src/app/services/users/users.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { deleteCustomers, deleteCustomersSuccess } from 'src/app/store/actions/customer.actions';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/store/reducers';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { getCustomerState } from 'src/app/store/selectors/customer.selectors';

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss'],
  providers: [DialogService]
})
export class ListCustomersComponent implements OnInit {

  @ViewChild('table') table: Table;
  deleteCustomer$: Subscription;
  customers$: Observable<Customer[]> = this.store.select(getCustomerState);
  selectedCustomers: Customer[];

  loading: boolean;
  canEdit: boolean;

  constructor(private translate: TranslateService, private message: ShowMessageService, private router: Router, private confirmationService: ConfirmationService, private dialogService: DialogService, private usersService: UsersService, private store: Store<AppState>, private _actions$: Actions) { }

  ngOnInit() {
    this.canEdit = this.usersService.checkPermission('manage-customers');
  }

  ngOnDestroy() {
    if (this.deleteCustomer$) this.deleteCustomer$.unsubscribe();
  }

  public openCustomerEditDialog(customer: Customer) {
    if (this.canEdit) {
      this.dialogService.open(CustomerEditDialogComponent, {
        data: {
          customer: customer
        },
        header: this.translate.instant('customers.update'),
        width: '75%'
      });
    }
  }

  public deleteSelectedCustomersConfirmation() {
    //Decides wich message to show depending on number of selected customers
    this.selectedCustomers.length > 1 ?
      this.showDeleteConfirmationMessage('customers.multiple_delete_customer') :
      this.showDeleteConfirmationMessage('customers.delete_customer');
  }

  private showDeleteConfirmationMessage(translationText: string) {
    //Asks to confirm the deleting of selected orders
    this.confirmationService.confirm({
      message: this.translate.instant(translationText),
      header: this.translate.instant('delete.delete_title'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.sendDeleteCustomersId() }
    });
  }

  private sendDeleteCustomersId() {
    //Deletes the selected orders
    let ids: number[] = [];
    this.selectedCustomers.forEach(order => ids.push(order.id));
    this.store.dispatch(deleteCustomers({ ids: ids }));

    this.deleteCustomer$ = this._actions$.pipe(ofType(deleteCustomersSuccess)).subscribe(() => {
      ids.length > 1 ?
        this.message.showMessage('success', 'drivers.invitation_delete_title', 'customers.multiple_delete_success') :
        this.message.showMessage('success', 'drivers.invitation_delete_title', 'customers.delete_success');
    });

    this.selectedCustomers = [];
  }

  public openExternalLink(external_id: string) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/customer/${external_id}/form`]));
    window.open(url, '_blank');
  }


}
