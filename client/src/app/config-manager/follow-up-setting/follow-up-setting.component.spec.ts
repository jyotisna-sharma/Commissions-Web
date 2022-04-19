import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpSettingComponent } from './follow-up-setting.component';

describe('FollowUpSettingComponent', () => {
  let component: FollowUpSettingComponent;
  let fixture: ComponentFixture<FollowUpSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
