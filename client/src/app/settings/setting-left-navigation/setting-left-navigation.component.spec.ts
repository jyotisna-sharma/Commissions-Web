import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingLeftNavigationComponent } from './setting-left-navigation.component';

describe('SettingLeftNavigationComponent', () => {
  let component: SettingLeftNavigationComponent;
  let fixture: ComponentFixture<SettingLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
