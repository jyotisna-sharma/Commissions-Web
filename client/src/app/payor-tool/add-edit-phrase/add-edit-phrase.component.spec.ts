import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPhraseComponent } from './add-edit-phrase.component';

describe('AddEditPhraseComponent', () => {
  let component: AddEditPhraseComponent;
  let fixture: ComponentFixture<AddEditPhraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPhraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
