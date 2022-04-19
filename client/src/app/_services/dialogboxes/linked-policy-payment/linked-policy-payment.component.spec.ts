import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedPolicyPaymentComponent } from './linked-policy-payment.component';

describe('LinkedPolicyPaymentComponent', () => {
  let component: LinkedPolicyPaymentComponent;
  let fixture: ComponentFixture<LinkedPolicyPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedPolicyPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedPolicyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
