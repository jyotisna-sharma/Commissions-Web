import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormulaComponent } from './test-formula.component';

describe('TestFormulaComponent', () => {
  let component: TestFormulaComponent;
  let fixture: ComponentFixture<TestFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
