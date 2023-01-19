import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Company } from 'src/app/interfaces/users';

export const getSelectedCompanyState = createFeatureSelector<Company>('selectedCompany');
export const checkSelectedCompanyManageUsers = createSelector(
    getSelectedCompanyState,
    (company: Company): boolean => company.role?.permissions?.some((permission: string) => permission === 'manage-users')
);