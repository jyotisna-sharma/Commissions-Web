import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorToolListComponent } from './payor-tool-list.component';

describe('PayorToolListComponent', () => {
  let component: PayorToolListComponent;
  let fixture: ComponentFixture<PayorToolListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayorToolListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayorToolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
