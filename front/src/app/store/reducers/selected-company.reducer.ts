import { createReducer, on } from '@ngrx/store';
import { Company } from 'src/app/interfaces/users';
import * as selectedCompanyActions from '../actions/selected-company.actions';

export const initialState: Company = new Company();

const _selectedCompanyReducer = createReducer(
    initialState,
    on(selectedCompanyActions.loadSelectedCompanySuccess, (state, { data }) => data),
    on(selectedCompanyActions.setSelectedCompany, (state, { selectedCompany }) => selectedCompany)
)

export function selectedCompanyReducer(state: any, action: any) {
    return _selectedCompanyReducer(state, action);
}