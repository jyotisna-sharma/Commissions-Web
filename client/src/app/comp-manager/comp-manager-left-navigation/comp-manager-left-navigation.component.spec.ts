import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompManagerLeftNavigationComponent } from './comp-manager-left-navigation.component';

describe('CompManagerLeftNavigationComponent', () => {
  let component: CompManagerLeftNavigationComponent;
  let fixture: ComponentFixture<CompManagerLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompManagerLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompManagerLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
