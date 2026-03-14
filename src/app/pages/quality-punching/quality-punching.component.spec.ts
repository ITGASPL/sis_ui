import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityPunchingComponent } from './quality-punching.component';

describe('QualityPunchingComponent', () => {
  let component: QualityPunchingComponent;
  let fixture: ComponentFixture<QualityPunchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityPunchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityPunchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
