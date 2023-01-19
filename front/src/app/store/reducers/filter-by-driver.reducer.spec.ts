import { _reducer, initialState } from './filter-by-driver.reducer';

describe('FilterByDriver Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = _reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
