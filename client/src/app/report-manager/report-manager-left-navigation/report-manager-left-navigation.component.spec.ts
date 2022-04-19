import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManagerLeftNavigationComponent } from './report-manager-left-navigation.component';

describe('ReportManagerLeftNavigationComponent', () => {
  let component: ReportManagerLeftNavigationComponent;
  let fixture: ComponentFixture<ReportManagerLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportManagerLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManagerLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
