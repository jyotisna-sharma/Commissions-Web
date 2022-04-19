import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportToolSettingsComponent } from './import-tool-settings.component';

describe('ImportToolSettingsComponent', () => {
  let component: ImportToolSettingsComponent;
  let fixture: ComponentFixture<ImportToolSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportToolSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportToolSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
