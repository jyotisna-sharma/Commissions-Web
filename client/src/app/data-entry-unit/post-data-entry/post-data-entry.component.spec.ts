import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDataEntryComponent } from './post-data-entry.component';

describe('PostDataEntryComponent', () => {
  let component: PostDataEntryComponent;
  let fixture: ComponentFixture<PostDataEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDataEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
