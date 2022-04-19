import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChartsComponent } from './custom-charts.component';

describe('CustomChartsComponent', () => {
  let component: CustomChartsComponent;
  let fixture: ComponentFixture<CustomChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
