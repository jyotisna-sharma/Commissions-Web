import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompManagerListComponent } from './comp-manager-list.component';

describe('CompManagerListComponent', () => {
  let component: CompManagerListComponent;
  let fixture: ComponentFixture<CompManagerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompManagerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
