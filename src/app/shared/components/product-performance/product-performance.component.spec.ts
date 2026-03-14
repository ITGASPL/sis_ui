import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppProductPerformanceComponent } from './product-performance.component';

describe('ProductPerformanceComponent', () => {
  let component: AppProductPerformanceComponent;
  let fixture: ComponentFixture<AppProductPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppProductPerformanceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppProductPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
