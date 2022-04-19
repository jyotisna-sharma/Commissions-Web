import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySmartFieldsComponent } from './policy-smart-fields.component';

describe('PolicySmartFieldsComponent', () => {
  let component: PolicySmartFieldsComponent;
  let fixture: ComponentFixture<PolicySmartFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicySmartFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySmartFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
