import { TestBed } from '@angular/core/testing';

import { DashboarDataService } from './dashboard-data.service';

describe('DashboarDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboarDataService = TestBed.get(DashboarDataService);
    expect(service).toBeTruthy();
  });
});
