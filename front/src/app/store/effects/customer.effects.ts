import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { addCustomerFailure, addCustomerSuccess, CustomerActionTypes, deleteCustomersFailure, deleteCustomersSuccess, loadCustomersFailure, loadCustomersSuccess, updateCustomerFailure, updateCustomerSuccess } from '../actions/customer.actions';
import { AppState } from '../reducers';


@Injectable()
export class CustomerEffects {



    constructor(private actions$: Actions, private customersService: CustomersService, private message: ShowMessageService, private router: Router) { }

    loadCustomers = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActionTypes.LoadCustomers),
            mergeMap((action) =>
                this.customersService.getCustomers(action['company_id'])
                    .pipe(
                        map((customers) => {
                            return loadCustomersSuccess({ data: customers })
                        }),
                        catchError((error) => of(loadCustomersFailure(error)))
                    )

            )
        )
    )

    addCustomer = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActionTypes.AddCustomer),
            mergeMap((action) => this.customersService.addCustomer(action['customer'])
                .pipe(
                    map((customer) => {
                        this.router.navigate(['/view/customers']);
                        this.message.showMessage('success', 'orders.success', 'customers.customer_created');
                        return addCustomerSuccess({ customer: customer })
                    }),
                    catchError((error) => of(addCustomerFailure(error)))
                )
            )
        )
    )

    updateCustomer = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActionTypes.UpdateCustomer),
            mergeMap((action) => this.customersService.updateCustomer(action['customer'])
                .pipe(
                    map((customer) => {
                        return updateCustomerSuccess({ updatedCustomer: customer })
                    }),
                    catchError((error) => of(updateCustomerFailure(error)))
                )
            )
        )
    )

    deleteCustomers = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActionTypes.DeleteCustomers),
            mergeMap((action) => this.customersService.deleteCustomers(action['ids'])
                .pipe(
                    map(() => {
                        return deleteCustomersSuccess({ ids: action['ids'] });
                    }),
                    catchError((error) => of(deleteCustomersFailure(error)))
                )
            )
        )
    )
}
