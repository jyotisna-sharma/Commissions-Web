import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiListComponent } from './mi-list.component';

describe('MiListComponent', () => {
  let component: MiListComponent;
  let fixture: ComponentFixture<MiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
