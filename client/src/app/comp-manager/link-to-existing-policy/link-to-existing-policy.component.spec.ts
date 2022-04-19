import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkToExistingPolicyComponent } from './link-to-existing-policy.component';

describe('LinkToExistingPolicyComponent', () => {
  let component: LinkToExistingPolicyComponent;
  let fixture: ComponentFixture<LinkToExistingPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkToExistingPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkToExistingPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
