import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportToolStatmentListComponent } from './import-tool-statment-list.component';

describe('ImportToolStatmentListComponent', () => {
  let component: ImportToolStatmentListComponent;
  let fixture: ComponentFixture<ImportToolStatmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportToolStatmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportToolStatmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
