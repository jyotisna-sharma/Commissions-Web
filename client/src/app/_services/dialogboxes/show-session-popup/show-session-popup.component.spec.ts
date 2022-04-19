import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSessionPopupComponent } from './show-session-popup.component';

describe('ShowSessionPopupComponent', () => {
  let component: ShowSessionPopupComponent;
  let fixture: ComponentFixture<ShowSessionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSessionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSessionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
