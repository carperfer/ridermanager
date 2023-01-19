import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { UserInfo } from "src/app/interfaces/users";
import { UsersService } from "src/app/services/users/users.service";
import { addCompanyFailure, addCompanySuccess, CompanyActionTypes, loadCompaniesFailure, loadCompaniesSuccess } from "../actions/company.actions";

@Injectable()
export class CompanyEffects {

    constructor(private actions$: Actions, private usersService: UsersService) { }

    loadCompanies = createEffect(() =>
        this.actions$.pipe(
            ofType(CompanyActionTypes.LoadCompanies),
            mergeMap(() => this.usersService.getAsyncUser()
                .pipe(
                    map((user: UserInfo) => {
                        return loadCompaniesSuccess({ data: user.companies })
                    }),
                    catchError((error) => of(loadCompaniesFailure(error)))
                )
            )
        )
    )

    addCompany = createEffect(() =>
        this.actions$.pipe(
            ofType(CompanyActionTypes.AddCompany),
            mergeMap((action) => this.usersService.createCompany({ name: action['company_name'] })
                .pipe(
                    map((company) => {
                        return addCompanySuccess({ company: company });
                    }),
                    catchError((error) => of(addCompanyFailure(error)))
                )
            )
        )
    )

}