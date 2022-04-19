import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommDashboardComponent } from './comm-dashboard.component';

describe('CommDashboardComponent', () => {
  let component: CommDashboardComponent;
  let fixture: ComponentFixture<CommDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
