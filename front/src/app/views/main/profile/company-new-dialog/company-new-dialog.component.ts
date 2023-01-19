import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { addCompany, addCompanySuccess } from 'src/app/store/actions/company.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-company-new-dialog',
  templateUrl: './company-new-dialog.component.html',
  styleUrls: ['./company-new-dialog.component.scss']
})
export class CompanyNewDialogComponent implements OnInit, OnDestroy {

  newCompanyForm: FormGroup;
  addCompany$: Subscription;

  constructor(private message: ShowMessageService, public dialog: DynamicDialogRef, private router: Router, private store: Store<AppState>, private _actions$: Actions) {
    this.newCompanyForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.addCompany$ = this._actions$.pipe(ofType(addCompanySuccess)).subscribe(() => {
      this.dialog.close();
      this.message.showMessage('success', 'orders.success', 'profile.create_company_success');
      this.router.navigate(['/view']);
    });
  }

  ngOnDestroy() {
    if (this.addCompany$) this.addCompany$.unsubscribe();
  }

  public createCompany() {
    this.store.dispatch(addCompany({ company_name: this.newCompanyForm.value.name }));
  }

}
