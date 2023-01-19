import { createAction, props } from '@ngrx/store';
import { Customer } from 'src/app/interfaces/customers';

export enum CustomerActionTypes {
  LoadCustomers = '[Customer] Load Customers',
  LoadCustomersSuccess = '[Customer] Load Customers Success',
  LoadCustomersFailure = '[Customer] Load Customers Failure',

  AddCustomer = '[Customer] Add Customer',
  AddCustomerSuccess = '[Customer] Add Customer Success',
  AddCustomerFailure = '[Customer] Add Customer Failure',

  AddCustomerFromRealtimeSuccess = '[Customer] Add Customer Success',
  AddCustomerFromRealtimeFailure = '[Customer] Add Customer Failure',

  UpdateCustomer = '[Customer] Update Customer',
  UpdateCustomerSuccess = '[Customer] Update Customer Success',
  UpdateCustomerFailure = '[Customer] Update Customer Failure',

  UpdateCustomerFromRealtimeSuccess = '[Customer] Update Customer Success',
  UpdateCustomerFromRealtimeFailure = '[Customer] Update Customer Failure',

  DeleteCustomers = '[Customer] Delete Customer',
  DeleteCustomersSuccess = '[Customer] Delete Customer Success',
  DeleteCustomersFailure = '[Customer] Delete Customer Failure',

  DeleteCustomerFromRealtimeSuccess = '[Customer] Delete Customer Success',
  DeleteCustomerFromRealtimeFailure = '[Customer] Delete Customer Failure'

}

export const loadCustomers = createAction(
  CustomerActionTypes.LoadCustomers,
  props<{ company_id: number }>()
);
export const loadCustomersSuccess = createAction(
  CustomerActionTypes.LoadCustomersSuccess,
  props<{ data: Customer[] }>()
);
export const loadCustomersFailure = createAction(
  CustomerActionTypes.LoadCustomersFailure,
  props<{ error: any }>()
);


export const addCustomer = createAction(
  CustomerActionTypes.AddCustomer,
  props<{ customer: Customer }>()
);
export const addCustomerSuccess = createAction(
  CustomerActionTypes.AddCustomerSuccess,
  props<{ customer: any }>()
);
export const addCustomerFailure = createAction(
  CustomerActionTypes.AddCustomerFailure,
  props<{ error: any }>()
);


export const updateCustomer = createAction(
  CustomerActionTypes.UpdateCustomer,
  props<{ customer: Customer }>()
);
export const updateCustomerSuccess = createAction(
  CustomerActionTypes.UpdateCustomerSuccess,
  props<{ updatedCustomer: any }>()
);
export const updateCustomerFailure = createAction(
  CustomerActionTypes.UpdateCustomerFailure,
  props<{ error: any }>()
);


export const deleteCustomers = createAction(
  CustomerActionTypes.DeleteCustomers,
  props<{ ids: number[] }>()
);
export const deleteCustomersSuccess = createAction(
  CustomerActionTypes.DeleteCustomersSuccess,
  props<{ ids: number[] }>()
);
export const deleteCustomersFailure = createAction(
  CustomerActionTypes.DeleteCustomersFailure,
  props<{ error: any }>()
);
