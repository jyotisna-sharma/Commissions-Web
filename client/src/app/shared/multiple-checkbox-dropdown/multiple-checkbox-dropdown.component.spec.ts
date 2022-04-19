import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCheckboxDropdownComponent } from './multiple-checkbox-dropdown.component';

describe('MultipleCheckboxDropdownComponent', () => {
  let component: MultipleCheckboxDropdownComponent;
  let fixture: ComponentFixture<MultipleCheckboxDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleCheckboxDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleCheckboxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
