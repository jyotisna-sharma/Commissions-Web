import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPaymentToPoliciesComponent } from './link-payment-to-policies.component';

describe('LinkPaymentToPoliciesComponent', () => {
  let component: LinkPaymentToPoliciesComponent;
  let fixture: ComponentFixture<LinkPaymentToPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkPaymentToPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPaymentToPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
