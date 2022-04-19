import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorToolLeftNavigationComponent } from './payor-tool-left-navigation.component';

describe('PayorToolLeftNavigationComponent', () => {
  let component: PayorToolLeftNavigationComponent;
  let fixture: ComponentFixture<PayorToolLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorToolLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorToolLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
