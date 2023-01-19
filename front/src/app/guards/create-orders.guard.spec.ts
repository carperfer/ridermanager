import { TestBed } from '@angular/core/testing';

import { CreateOrdersGuard } from './create-orders.guard';

describe('CreateOrdersGuard', () => {
  let guard: CreateOrdersGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateOrdersGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
