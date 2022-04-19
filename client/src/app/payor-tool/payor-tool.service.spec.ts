import { TestBed } from '@angular/core/testing';

import { PayorToolService } from './payor-tool.service';

describe('PayorToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayorToolService = TestBed.get(PayorToolService);
    expect(service).toBeTruthy();
  });
});
