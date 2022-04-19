import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayorContactComponent } from './edit-payor-contact.component';

describe('EditPayorContactComponent', () => {
  let component: EditPayorContactComponent;
  let fixture: ComponentFixture<EditPayorContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPayorContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPayorContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
