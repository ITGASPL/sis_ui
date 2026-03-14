import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDailyActivitiesComponent } from './daily-activities.component';

describe('DailyActivitiesComponent', () => {
  let component: AppDailyActivitiesComponent;
  let fixture: ComponentFixture<AppDailyActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDailyActivitiesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDailyActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
