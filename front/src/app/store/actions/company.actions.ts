import { createAction, props } from "@ngrx/store";
import { Company } from "src/app/interfaces/users";

export enum CompanyActionTypes {
    LoadCompanies = '[Company] Load Companies',
    LoadCompaniesSuccess = '[Company] Load Companies Success',
    LoadCompaniesFailure = '[Company] Load Companies Failure',

    AddCompany = '[Company] Add Company',
    AddCompanySuccess = '[Company] Add Company Success',
    AddCompanyFailure = '[Company] Add Company Failure',
}

export const loadCompanies = createAction(
    CompanyActionTypes.LoadCompanies
);
export const loadCompaniesSuccess = createAction(
    CompanyActionTypes.LoadCompaniesSuccess,
    props<{ data: Company[] }>()
);
export const loadCompaniesFailure = createAction(
    CompanyActionTypes.LoadCompaniesFailure,
    props<{ error: any }>()
);


export const addCompany = createAction(
    CompanyActionTypes.AddCompany,
    props<{ company_name: string }>()
);
export const addCompanySuccess = createAction(
    CompanyActionTypes.AddCompanySuccess,
    props<{ company: any }>()
);
export const addCompanyFailure = createAction(
    CompanyActionTypes.AddCompanyFailure,
    props<{ error: any }>()
);