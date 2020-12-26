import { TestBed } from '@angular/core/testing';

import { KeepaliveService } from './keepalive.service';

describe('KeepaliveService', () => {
  let service: KeepaliveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeepaliveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
