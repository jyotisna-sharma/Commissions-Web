import { TestBed } from '@angular/core/testing';

import { ReportManagerURLService } from './report-manager-url.service';

describe('ReportManagerURLService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportManagerURLService = TestBed.get(ReportManagerURLService);
    expect(service).toBeTruthy();
  });
});
