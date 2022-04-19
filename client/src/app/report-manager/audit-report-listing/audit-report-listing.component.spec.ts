import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportListingComponent } from './audit-report-listing.component';

describe('AuditReportListingComponent', () => {
  let component: AuditReportListingComponent;
  let fixture: ComponentFixture<AuditReportListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditReportListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
