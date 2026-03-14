import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSalesOverviewComponent } from './sales-overview.component';

describe('SalesOverviewComponent', () => {
  let component: AppSalesOverviewComponent;
  let fixture: ComponentFixture<AppSalesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppSalesOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSalesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
