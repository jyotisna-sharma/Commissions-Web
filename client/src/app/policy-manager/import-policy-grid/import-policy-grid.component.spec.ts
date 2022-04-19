import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPolicyGridComponent } from './import-policy-grid.component';

describe('ImportPolicyGridComponent', () => {
  let component: ImportPolicyGridComponent;
  let fixture: ComponentFixture<ImportPolicyGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPolicyGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPolicyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
