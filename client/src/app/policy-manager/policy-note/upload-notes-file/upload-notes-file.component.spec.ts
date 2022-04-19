import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNotesFileComponent } from './upload-notes-file.component';

describe('UploadNotesFileComponent', () => {
  let component: UploadNotesFileComponent;
  let fixture: ComponentFixture<UploadNotesFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadNotesFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNotesFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
