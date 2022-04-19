import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchStatementListComponent } from './batch-statement-list.component';

describe('BatchStatementListComponent', () => {
  let component: BatchStatementListComponent;
  let fixture: ComponentFixture<BatchStatementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchStatementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchStatementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
