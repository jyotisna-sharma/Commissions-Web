import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompTypeComponent } from './add-edit-comp-type.component';

describe('AddEditCompTypeComponent', () => {
  let component: AddEditCompTypeComponent;
  let fixture: ComponentFixture<AddEditCompTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCompTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCompTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
