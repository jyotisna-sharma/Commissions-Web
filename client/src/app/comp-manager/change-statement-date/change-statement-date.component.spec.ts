import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatementDateComponent } from './change-statement-date.component';

describe('ChangeStatementDateComponent', () => {
  let component: ChangeStatementDateComponent;
  let fixture: ComponentFixture<ChangeStatementDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStatementDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatementDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
