import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiAutocompleteComponent } from './mi-autocomplete.component';

describe('MiAutocompleteComponent', () => {
  let component: MiAutocompleteComponent;
  let fixture: ComponentFixture<MiAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
