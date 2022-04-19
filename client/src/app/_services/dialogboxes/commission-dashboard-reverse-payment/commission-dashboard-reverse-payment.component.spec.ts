import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionDashboardReversePaymentComponent } from './commission-dashboard-reverse-payment.component';

describe('CommissionDashboardReversePaymentComponent', () => {
  let component: CommissionDashboardReversePaymentComponent;
  let fixture: ComponentFixture<CommissionDashboardReversePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionDashboardReversePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionDashboardReversePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
