import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeftNavigationComponent } from './client-left-navigation.component';

describe('ClientLeftNavigationComponent', () => {
  let component: ClientLeftNavigationComponent;
  let fixture: ComponentFixture<ClientLeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeftNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
