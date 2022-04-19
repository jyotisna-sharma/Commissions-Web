import { PolicyManagerModule } from './policy-manager.module';

describe('PolicyManagerModule', () => {
  let policyManagerModule: PolicyManagerModule;

  beforeEach(() => {
    policyManagerModule = new PolicyManagerModule();
  });

  it('should create an instance', () => {
    expect(policyManagerModule).toBeTruthy();
  });
});
