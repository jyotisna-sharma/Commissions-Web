import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAgentComponent } from './add-edit-agent.component';

describe('AddEditAgentComponent', () => {
  let component: AddEditAgentComponent;
  let fixture: ComponentFixture<AddEditAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
