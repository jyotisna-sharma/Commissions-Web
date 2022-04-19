import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiButtonComponent } from './mi-button.component';

describe('MiButtonComponent', () => {
  let component: MiButtonComponent;
  let fixture: ComponentFixture<MiButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
