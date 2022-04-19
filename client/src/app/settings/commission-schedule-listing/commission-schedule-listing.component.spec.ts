import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionScheduleListingComponent } from './commission-schedule-listing.component';

describe('CommissionScheduleListingComponent', () => {
  let component: CommissionScheduleListingComponent;
  let fixture: ComponentFixture<CommissionScheduleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionScheduleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionScheduleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
