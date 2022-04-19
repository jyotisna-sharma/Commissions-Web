import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorListingComponent } from './payor-listing.component';

describe('PayorListingComponent', () => {
  let component: PayorListingComponent;
  let fixture: ComponentFixture<PayorListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
