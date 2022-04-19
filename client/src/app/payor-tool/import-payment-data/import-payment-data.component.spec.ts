import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPaymentDataComponent } from './import-payment-data.component';

describe('ImportPaymentDataComponent', () => {
  let component: ImportPaymentDataComponent;
  let fixture: ComponentFixture<ImportPaymentDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPaymentDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPaymentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
