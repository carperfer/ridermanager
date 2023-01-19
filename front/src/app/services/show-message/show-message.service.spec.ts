import { TestBed } from '@angular/core/testing';

import { ShowMessageService } from './show-message.service';

describe('ShowMessageService', () => {
  let service: ShowMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
