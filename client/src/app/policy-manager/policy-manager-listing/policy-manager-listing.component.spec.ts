import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyManagerListingComponent } from './policy-manager-listing.component';

describe('PolicyManagerListingComponent', () => {
  let component: PolicyManagerListingComponent;
  let fixture: ComponentFixture<PolicyManagerListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyManagerListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyManagerListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
