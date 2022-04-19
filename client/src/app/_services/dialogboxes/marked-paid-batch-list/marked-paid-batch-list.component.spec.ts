import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkedPaidBatchListComponent } from './marked-paid-batch-list.component';

describe('MarkedPaidBatchListComponent', () => {
  let component: MarkedPaidBatchListComponent;
  let fixture: ComponentFixture<MarkedPaidBatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkedPaidBatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkedPaidBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
