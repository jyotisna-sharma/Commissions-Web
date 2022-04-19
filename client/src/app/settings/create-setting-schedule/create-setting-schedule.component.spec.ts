import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSettingScheduleComponent } from './create-setting-schedule.component';

describe('CreateSettingScheduleComponent', () => {
  let component: CreateSettingScheduleComponent;
  let fixture: ComponentFixture<CreateSettingScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSettingScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSettingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
