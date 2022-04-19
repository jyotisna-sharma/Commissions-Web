import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementReportListingComponent } from './management-report-listing.component';

describe('ManagementReportListingComponent', () => {
  let component: ManagementReportListingComponent;
  let fixture: ComponentFixture<ManagementReportListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementReportListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
