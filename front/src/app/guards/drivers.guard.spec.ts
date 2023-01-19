import { TestBed } from '@angular/core/testing';

import { DriversGuard } from './drivers.guard';

describe('DriversGuard', () => {
  let guard: DriversGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DriversGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
