import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPolicyComponent } from './create-new-policy.component';

describe('CreateNewPolicyComponent', () => {
  let component: CreateNewPolicyComponent;
  let fixture: ComponentFixture<CreateNewPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
