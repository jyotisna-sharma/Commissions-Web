import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierListingComponent } from './carrier-listing.component';

describe('CarrierListingComponent', () => {
  let component: CarrierListingComponent;
  let fixture: ComponentFixture<CarrierListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
