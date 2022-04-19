import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorContactsComponent } from './payor-contacts.component';

describe('PayorContactsComponent', () => {
  let component: PayorContactsComponent;
  let fixture: ComponentFixture<PayorContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
