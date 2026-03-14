import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheetDetectionSheetComponent } from './sheet-thickness.component';

describe('SheetDetectionSheetComponent', () => {
  let component: SheetDetectionSheetComponent;
  let fixture: ComponentFixture<SheetDetectionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetDetectionSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDetectionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
