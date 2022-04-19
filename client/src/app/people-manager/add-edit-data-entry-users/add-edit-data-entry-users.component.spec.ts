import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDataEntryUsersComponent } from './add-edit-data-entry-users.component';

describe('AddEditDataEntryUsersComponent', () => {
  let component: AddEditDataEntryUsersComponent;
  let fixture: ComponentFixture<AddEditDataEntryUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDataEntryUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDataEntryUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
