import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentListingComponent } from './segment-listing.component';

describe('SegmentListingComponent', () => {
  let component: SegmentListingComponent;
  let fixture: ComponentFixture<SegmentListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
