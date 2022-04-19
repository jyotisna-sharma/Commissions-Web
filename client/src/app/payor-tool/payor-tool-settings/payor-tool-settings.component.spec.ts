import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorToolSettingsComponent } from './payor-tool-settings.component';

describe('PayorToolSettingsComponent', () => {
  let component: PayorToolSettingsComponent;
  let fixture: ComponentFixture<PayorToolSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorToolSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorToolSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
