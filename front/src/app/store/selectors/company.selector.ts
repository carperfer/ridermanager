import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Company } from 'src/app/interfaces/users';
import { AppState } from '../reducers';

export const getCompaniesState = createFeatureSelector<AppState>('companies');
export const getCompanies = createSelector(    
    (state: AppState) => state.companies,
    (companies: Company[]) => companies
);