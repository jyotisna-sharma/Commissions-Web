import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePolicyComponent } from './activate-policy.component';

describe('ActivatePolicyComponent', () => {
  let component: ActivatePolicyComponent;
  let fixture: ComponentFixture<ActivatePolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
