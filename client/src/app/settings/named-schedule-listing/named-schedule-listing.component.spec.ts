import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedScheduleListingComponent } from './named-schedule-listing.component';

describe('NamedScheduleListingComponent', () => {
  let component: NamedScheduleListingComponent;
  let fixture: ComponentFixture<NamedScheduleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamedScheduleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedScheduleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
