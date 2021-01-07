import { TestBed } from '@angular/core/testing';

import { SmartAudioService } from './smart-audio.service';

describe('SmartAudioService', () => {
  let service: SmartAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
