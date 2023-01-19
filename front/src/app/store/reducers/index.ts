import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { Order } from 'src/app/interfaces/orders';
import { Company } from 'src/app/interfaces/users';
import { environment } from '../../../environments/environment';
import { companyReducer } from './company.reducer';
import { customerReducer } from './customer.reducer';
import { driverReducer } from './driver.reducer';
import { filterByDriverReducer } from './filter-by-driver.reducer';
import { filterByStatusReducer } from './filter-by-status.reducer';
import { orderReducer } from './order.reducer';
import { selectedCompanyReducer } from './selected-company.reducer';

export interface AppState {
  orders: Order[],
  customers: any,
  drivers: any,
  filterByDriver: any,
  filterByStatus: any,
  companies: Company[],
  selectedCompany: any
}

export const reducers: ActionReducerMap<AppState> = {
  orders: orderReducer,
  customers: customerReducer,
  drivers: driverReducer,
  filterByDriver: filterByDriverReducer,
  filterByStatus: filterByStatusReducer,
  companies: companyReducer,
  selectedCompany: selectedCompanyReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
