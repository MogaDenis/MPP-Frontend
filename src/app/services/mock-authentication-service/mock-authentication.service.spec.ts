import { TestBed } from '@angular/core/testing';

import { MockAuthenticationService } from './mock-authentication.service';

describe('MockAuthenticationService', () => {
  let service: MockAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
