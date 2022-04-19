import { TestBed } from '@angular/core/testing';

import { PeopleManagerValidationMessageService } from './people-manager-validation-message.service';

describe('PeopleManagerValidationMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeopleManagerValidationMessageService = TestBed.get(PeopleManagerValidationMessageService);
    expect(service).toBeTruthy();
  });
});
