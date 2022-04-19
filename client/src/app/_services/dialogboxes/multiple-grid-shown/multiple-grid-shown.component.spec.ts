import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleGridShownComponent } from './multiple-grid-shown.component';

describe('MultipleGridShownComponent', () => {
  let component: MultipleGridShownComponent;
  let fixture: ComponentFixture<MultipleGridShownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleGridShownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleGridShownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
