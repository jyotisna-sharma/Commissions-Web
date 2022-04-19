import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleManagerLeftNavigationComponent } from './people-manager-left-navigation.component';

describe('PeopleManagerLeftNavigationComponent', () => {
  let component: PeopleManagerLeftNavigationComponent;
  let fixture: ComponentFixture<PeopleManagerLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleManagerLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleManagerLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
