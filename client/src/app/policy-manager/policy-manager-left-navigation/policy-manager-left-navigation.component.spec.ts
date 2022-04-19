import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyManagerLeftNavigationComponent } from './policy-manager-left-navigation.component';

describe('PolicyManagerLeftNavigationComponent', () => {
  let component: PolicyManagerLeftNavigationComponent;
  let fixture: ComponentFixture<PolicyManagerLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyManagerLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyManagerLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
