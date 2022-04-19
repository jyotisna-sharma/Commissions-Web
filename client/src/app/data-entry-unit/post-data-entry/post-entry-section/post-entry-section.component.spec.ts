import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEntrySectionComponent } from './post-entry-section.component';

describe('PostEntrySectionComponent', () => {
  let component: PostEntrySectionComponent;
  let fixture: ComponentFixture<PostEntrySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEntrySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEntrySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
