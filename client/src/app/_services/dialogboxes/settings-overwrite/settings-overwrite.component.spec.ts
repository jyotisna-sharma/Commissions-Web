import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsOverwriteComponent } from './settings-overwrite.component';

describe('SettingsOverwriteComponent', () => {
  let component: SettingsOverwriteComponent;
  let fixture: ComponentFixture<SettingsOverwriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsOverwriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsOverwriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
