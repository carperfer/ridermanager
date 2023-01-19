import * as fromDriver from './driver.actions';

describe('loadDrivers', () => {
  it('should return an action', () => {
    expect(fromDriver.loadDrivers().type).toBe('[Driver] Load Drivers');
  });
});
