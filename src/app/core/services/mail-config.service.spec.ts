import { TestBed, inject } from '@angular/core/testing';

import { MailConfigService } from './mail-config.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MailConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MailConfigService]
    });
  });

  it('should be created', inject([MailConfigService], (service: MailConfigService) => {
    expect(service).toBeTruthy();
  }));
});
