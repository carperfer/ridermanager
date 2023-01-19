import { createReducer, on } from '@ngrx/store';
import { Customer } from 'src/app/interfaces/customers';
import * as customerActions from '../actions/customer.actions';

export const initialState: Customer[] = [
  new Customer()
];

const _customerReducer = createReducer(
  initialState,
  on(customerActions.loadCustomersSuccess, (state, { data }) => data),
  on(customerActions.addCustomerSuccess, (state, { customer }) => [...JSON.parse(JSON.stringify(state)), customer]),
  on(customerActions.updateCustomerSuccess, (state, { updatedCustomer }) => {
    return state.map(customer => {
      if (customer.id === updatedCustomer.id) {
        return {
          ...updatedCustomer
        }
      }
      else {
        return customer
      }
    })
  }),
  on(customerActions.deleteCustomersSuccess, (state, { ids }) => {
    return [...state.filter(customer => {
      let notDeleted = true;
      ids.forEach(id => {
        if (customer.id === id) notDeleted = false;
      })
      return notDeleted;
    })]
  })
)

export function customerReducer(state: any, action: any) {
  return _customerReducer(state, action);
}

