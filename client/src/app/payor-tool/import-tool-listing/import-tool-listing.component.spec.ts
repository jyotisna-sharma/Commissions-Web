import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportToolListingComponent } from './import-tool-listing.component';

describe('ImportToolListingComponent', () => {
  let component: ImportToolListingComponent;
  let fixture: ComponentFixture<ImportToolListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportToolListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportToolListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
