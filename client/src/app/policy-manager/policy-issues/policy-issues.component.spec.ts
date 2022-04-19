import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyIssuesComponent } from './policy-issues.component';

describe('PolicyIssuesComponent', () => {
  let component: PolicyIssuesComponent;
  let fixture: ComponentFixture<PolicyIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
