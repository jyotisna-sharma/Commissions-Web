import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryUserListingComponent } from './data-entry-user-listing.component';

describe('DataEntryUserListingComponent', () => {
  let component: DataEntryUserListingComponent;
  let fixture: ComponentFixture<DataEntryUserListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataEntryUserListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryUserListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
