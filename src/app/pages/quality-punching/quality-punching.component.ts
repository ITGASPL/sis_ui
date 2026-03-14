import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SheetDetectionSheetComponent } from 'src/app/shared/components/sheet-thickness/sheet-thickness.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { DownloadReportsDataService } from 'src/app/core/services/download-reports.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';
import {
  AfterViewInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-quality-punching',
  imports: [
    RouterModule,
    MatListModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MaterialModule,
    FilterBarComponent,
  ],
  templateUrl: './quality-punching.component.html',
  styleUrls: ['./quality-punching.component.scss'],
})
export class QualityPunchingComponent
  implements OnInit, AfterViewInit, OnChanges
{
  displayedColumns: string[] = [
    'machine',
    'model',
    'partName',
    'startTime',
    'endTime',
    'inspectionResult',
    'actualProdQty',
    'holdQty',
    'shift',
  ];
  isSpinning = false;
  downloadedData: any = [];
  reportData: any[] = [];
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private downloadService: DownloadReportsDataService,
  ) {}
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['reportData']) {
      this.dataSource.data = this.reportData;
    }
  }

  ngOnInit(): void {
    this.loadData();
    // this.dataSource.data = this.reportData;
  }

  loadData() {
    this.isLoading = true;
    const result = {
      fromDate: '2025-05-27 00:50:00', // Example start date
      toDate: '2025-05-27 23:59:59', // Example end date
    };
    this.downloadService
      .getdownloadFilteredReportData(result.fromDate, result.toDate)
      .subscribe({
        next: (res) => {
          this.reportData = res.varientWiseSummury
            ? res.varientWiseSummury
            : [];
          console.log('Report Data', this.reportData);
          this.dataSource.data = this.reportData;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false; // Hide loader on error
        },
      });
  }

  downloadStyledExcel1(data: any[]) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Production Report');

    // Top title row
    const titleRow = worksheet.addRow(['Production Report']);
    worksheet.mergeCells('A1:T1');
    titleRow.font = { size: 16, bold: true };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.height = 30;
    titleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF92D050' }, // Green
    };

    // Header row
    const headerRow = worksheet.addRow([
      'S.No.',
      'Machine Name',
      'Model Id',
      'Model Name',
      'Variant Name',
      'Coil Code',
      'Part Name',
      'Shift',
      'Report Start Date',
      'Report End Date',
      'Variant Start Time',
      'Variant End Time',
      'Actual Production Qty',
      'Rejection Qty',
      'Quality %',
      'Nominal Thickness',
      'Actual Thickness Min',
      'Actual Thickness Max',
      'Rejection Qty (Thickness)',
      'Inspection Result',
    ]);

    headerRow.font = { bold: true };
    headerRow.height = 25;
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }, // Light blue
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Auto filter on header
    worksheet.autoFilter = {
      from: 'A2',
      to: 'T2',
    };

    // Freeze top 2 rows
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 2 }];

    // Add data rows
    data.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.equipmentNAme,
        item.modelId,
        item.modelName,
        item.varientName,
        item.coildCode,
        item.partName,
        item.shift,
        new Date(item.reportStartDate).toLocaleString(),
        new Date(item.reportEndDate).toLocaleString(),
        new Date(item.varientStartTime).toLocaleString(),
        new Date(item.varientEndTime).toLocaleString(),
        item.actualProductionQuantity,
        item.rejectionQuantity,
        item.qualityPercentage,
        item.nominalThickness,
        item.actualThicknessMin,
        item.actualThicknessMax,
        item.rejectionQuanitityThickness,
        item.inspectionResult,
      ]);
    });

    // Set column widths
    (worksheet.columns as { width: number }[]).forEach(
      (column: { width: number }) => {
        column.width = 22;
      },
    );

    // Export the file
    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'Filtered_Production_Report.xlsx');
    });
  }

  openPopup() {
    const dialogRef = this.dialog.open(DownloadPopupComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);

      if (result?.fromDate && result?.toDate) {
        this.isLoading = true; // Show loader

        this.downloadService
          .getdownloadFilteredReportData(result.fromDate, result.toDate)
          .subscribe({
            next: (res) => {
              this.downloadedData = res.varientWiseSummury
                ? res.varientWiseSummury
                : [];
              console.log(this.downloadedData);
              this.downloadStyledExcel1(this.downloadedData);
            },
            error: (err) => {
              console.error(err);
              this.isLoading = false; // Hide loader on error
            },
            complete: () => {
              this.isLoading = false; // Hide loader when done
            },
          });
      }
    });
  }

  startSpin() {
    this.isSpinning = true;
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000); // Spin for 1 second
  }
}
