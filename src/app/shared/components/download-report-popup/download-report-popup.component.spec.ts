import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportPopupComponent } from './download-report-popup.component';

describe('DownloadReportPopupComponent', () => {
  let component: DownloadReportPopupComponent;
  let fixture: ComponentFixture<DownloadReportPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadReportPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadReportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
