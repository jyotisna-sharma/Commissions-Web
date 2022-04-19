import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAdvanceSearchComponent } from './policy-advance-search.component';

describe('PolicyAdvanceSearchComponent', () => {
  let component: PolicyAdvanceSearchComponent;
  let fixture: ComponentFixture<PolicyAdvanceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyAdvanceSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
