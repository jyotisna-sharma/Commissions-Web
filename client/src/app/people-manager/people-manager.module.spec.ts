import { PeopleManagerModule } from './people-manager.module';

describe('PeopleManagerModule', () => {
  let peopleManagerModule: PeopleManagerModule;

  beforeEach(() => {
    peopleManagerModule = new PeopleManagerModule();
  });

  it('should create an instance', () => {
    expect(peopleManagerModule).toBeTruthy();
  });
});


