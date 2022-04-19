import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNoteComponent } from './policy-note.component';

describe('PolicyNoteComponent', () => {
  let component: PolicyNoteComponent;
  let fixture: ComponentFixture<PolicyNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
