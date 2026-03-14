import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectionPopupViewComponent } from './inspection-popupview.component';

describe('InspectionPopupViewComponent', () => {
  let component: InspectionPopupViewComponent;
  let fixture: ComponentFixture<InspectionPopupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspectionPopupViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionPopupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
