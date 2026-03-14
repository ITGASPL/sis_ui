import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppBlogComponent } from './apps-blog.component';

describe('AppsBlogComponent', () => {
  let component: AppBlogComponent;
  let fixture: ComponentFixture<AppBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppBlogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
