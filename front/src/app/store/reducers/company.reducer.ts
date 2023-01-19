import { createReducer, on } from '@ngrx/store';
import { Company } from 'src/app/interfaces/users';
import * as companyActions from '../actions/company.actions';

export const initialState: Company[] = [];

const _companyReducer = createReducer(
    initialState,
    on(companyActions.loadCompaniesSuccess, (state, { data }) => data),
    on(companyActions.addCompanySuccess, (state, { company }) => [...JSON.parse(JSON.stringify(state)), company])
)

export function companyReducer(state: any, action: any) {
    return _companyReducer(state, action);
}