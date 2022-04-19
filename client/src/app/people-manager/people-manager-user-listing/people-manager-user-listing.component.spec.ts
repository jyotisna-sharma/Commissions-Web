import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleManagerUserListingComponent } from './people-manager-user-listing.component';

describe('PeopleManagerUserListingComponent', () => {
  let component: PeopleManagerUserListingComponent;
  let fixture: ComponentFixture<PeopleManagerUserListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleManagerUserListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleManagerUserListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
