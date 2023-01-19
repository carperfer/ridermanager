import { createAction, props } from "@ngrx/store";
import { Company } from "src/app/interfaces/users";

export enum SelectedCompanyActionTypes {
    LoadSelectedCompany = '[SelectedCompany] Load SelectedComoany',
    LoadSelectedCompanySuccess = '[SelectedCompany] Load SelectedComoany Success',
    LoadSelectedCompanyFailure = '[SelectedCompany] Load SelectedComoany Failure',

    SetSelectedCompany = '[Company] Set SelectedCompany',
    SetSelectedCompanySuccess = '[Company] Set SelectedCompany Success',
    SetSelectedCompanyFailure = '[Company] Set SelectedCompany Failure',
}

export const loadSelectedCompany = createAction(
    SelectedCompanyActionTypes.LoadSelectedCompany
);
export const loadSelectedCompanySuccess = createAction(
    SelectedCompanyActionTypes.LoadSelectedCompanySuccess,
    props<{ data: Company }>()
);
export const loadSelectedCompanyFailure = createAction(
    SelectedCompanyActionTypes.LoadSelectedCompanyFailure,
    props<{ error: any }>()
);


export const setSelectedCompany = createAction(
    SelectedCompanyActionTypes.SetSelectedCompany,
    props<{ selectedCompany: Company }>()
);
export const setSelectedCompanySuccess = createAction(
    SelectedCompanyActionTypes.SetSelectedCompanySuccess,
    props<{ selectedCompany: any }>()
);
export const setSelectedCompanyFailure = createAction(
    SelectedCompanyActionTypes.SetSelectedCompanyFailure,
    props<{ error: any }>()
);