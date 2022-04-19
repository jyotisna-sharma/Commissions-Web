import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEntryBottomSectionComponent } from './post-entry-bottom-section.component';

describe('PostEntryBottomSectionComponent', () => {
  let component: PostEntryBottomSectionComponent;
  let fixture: ComponentFixture<PostEntryBottomSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEntryBottomSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEntryBottomSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
