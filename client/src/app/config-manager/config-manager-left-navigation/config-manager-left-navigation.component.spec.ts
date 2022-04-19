import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigManagerLeftNavigationComponent } from './config-manager-left-navigation.component';

describe('ConfigManagerLeftNavigationComponent', () => {
  let component: ConfigManagerLeftNavigationComponent;
  let fixture: ComponentFixture<ConfigManagerLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigManagerLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigManagerLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
