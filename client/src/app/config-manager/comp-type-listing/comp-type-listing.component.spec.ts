import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompTypeListingComponent } from './comp-type-listing.component';

describe('CompTypeListingComponent', () => {
  let component: CompTypeListingComponent;
  let fixture: ComponentFixture<CompTypeListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompTypeListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompTypeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
