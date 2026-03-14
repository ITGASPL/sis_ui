import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectionSheetComponent } from './production-sheet.component';

describe('InspectionSheetComponent', () => {
  let component: InspectionSheetComponent;
  let fixture: ComponentFixture<InspectionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspectionSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
