import { createFeatureSelector } from '@ngrx/store';
import { Customer } from 'src/app/interfaces/customers';

export const getCustomerState = createFeatureSelector<Customer[]>('customers');
