import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { AppProductPerformanceComponent } from 'src/app/shared/components/product-performance/product-performance.component';
import { SheetDetectionSheetComponent } from 'src/app/shared/components/sheet-thickness/sheet-thickness.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { PieChartComponent } from 'src/app/shared/components/pie-chart/pie-chart.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { DefectCategoryService } from './services/defect-category.service';
import { PartwiseBarSummaryService } from './services/partwise-bar-summary.service';
import { ShopViewService } from './services/shop-view.service';
// Ensure the service is correctly imported
import { DownloadReportsDataService } from 'src/app/core/services/download-reports.service';
import { MachineLiveStatusComponent } from 'src/app/shared/components/machine-live-status/machine-live-status.component';
import { saveAs } from 'file-saver'; // For saving file
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';

PartwiseBarSummaryService;
interface Employee {
  id: string;
  employee_name: string;
  employee_salary: string;
  employee_age: string;
  profile_image: string;
}

interface EmployeeResponse {
  status: string;
  data: Employee[];
}

@Component({
  selector: 'shop-view-page',
  imports: [
    RouterModule,
    MatListModule,
    CommonModule,
    MatCardModule,
    AppProductPerformanceComponent,
    SheetDetectionSheetComponent,
    MatIconModule,
    MaterialModule,
    ChartComponent,
    PieChartComponent,
    MachineLiveStatusComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule, // 👈 Needed for DateAdapter
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.scss'],
})
export class ShopViewComponent implements OnInit, OnDestroy {
  private refreshShopViewData!: Subscription;

  lastUpdated = '09/04/2025 11:30 AM';

  sites = ['SMG', 'XYZ'];
  locations = ['Gujrat', 'Delhi'];
  plants = ['PLT-A', 'PLT-B'];
  shops = ['Press-Shop', 'Assembly'];

  selectedSite = this.sites[0];
  selectedLocation = this.locations[0];
  selectedPlant = this.plants[0];
  selectedShop = this.shops[0];
  downloadedData: any = [];
  isLoading = false;
  //mockData:any;
  loadingBarchart = false;
  errorMessageBarchart = '';
  loadingPieChart = false;
  errorMessagePieChart = '';
  tableFetchTime: Date = new Date();
  chartDataFetchTime: Date = new Date();
  machineStatus: any;
  piechartData: any;
  barchartData: any;
  elementData: any;
  mockdata: any;
  downloadExcelData = [
    {
      equipmentId: 1,
      equipmentNAme: 'BL-1',
      modelId: 1,
      modelName: 'YTB',
      varientId: 1,
      varientName: 'YTB REAR FLOOR REAR 2WD (CR with Hole tire carrier)',
      programId: 1,
      programNumber: 1,
      coildCode: 'I1167020U06',
      varientCode: '613_1',
      partName: 'REAR FLOOR RR',
      shift: 'A',
      reportStartDate: 1746167456000,
      reportEndDate: 1746253740000,
      varientStartTime: 1746178351000,
      varientEndDate: 1746178410000,
      actualProductionQuantity: 85,
      rejectionQuantity: 85,
      qualityPercentage: 0.0,
      nominalThickness: 0.55,
      actualThicknessMin: 1.1816666666666666,
      actualThicknessMax: 1.8150000000000002,
      rejectionQuanitityThickness: 85,
      inspectionResult: 'NG',
      goodSheets: null,
      defectNames: 'Scratch/Dent',
    },
  ];
  downloadedData1 = [
    {
      equipmentId: 1,
      equipmentNAme: 'BL-1',
      modelId: 1,
      modelName: 'YTB',
      varientId: 1,
      varientName: 'YTB REAR FLOOR REAR 2WD (CR with Hole tire carrier)',
      programId: 1,
      programNumber: 1,
      coildCode: 'I1167020U06',
      varientCode: '613_1',
      partName: 'REAR FLOOR RR',
      shift: 'A',
      reportStartDate: 1746167456000,
      reportEndDate: 1746253740000,
      varientStartTime: 1746178351000,
      varientEndDate: 1746178410000,
      actualProductionQuantity: 85,
      rejectionQuantity: 85,
      qualityPercentage: 0.0,
      nominalThickness: 0.55,
      actualThicknessMin: 1.1816666666666666,
      actualThicknessMax: 1.8150000000000002,
      rejectionQuanitityThickness: 85,
      inspectionResult: 'NG',
      goodSheets: null,
      defectNames: 'Scratch/Dent',
    },
  ];
  isSpinning = false;
  currentDateTime: string = '';
  isDayView = true;
  productionViewFlag = true; // Flag to determine if it's production view or current view
  //private refreshShopViewData!: Subscription;
  toggleView(event: Event): void {
    this.isDayView = (event.target as HTMLInputElement).checked;
    console.log('Current view:', this.isDayView ? 'Day View' : 'Current View');

    if (this.isDayView) {
      //this.loadDayViewData();
      this.productionViewFlag = false; // Set flag for production view
      this.getTableData(this.productionViewFlag);
    } else {
      // this.loadCurrentViewData();
      this.productionViewFlag = true;
      this.getTableData(this.productionViewFlag);
    }
  }
  fetchTableData(event: Event): void {
    this.getTableData(this.productionViewFlag);
  }
  constructor(
    private dialog: MatDialog,
    private defectCategoryService: DefectCategoryService,
    private partwiseBarSummaryService: PartwiseBarSummaryService,
    private shopViewService: ShopViewService,
    private downloadService: DownloadReportsDataService,
  ) {}

  items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
  showDownloadPopup = false;

  toggleDownload() {
    this.showDownloadPopup = !this.showDownloadPopup;
  }

  loadingProductPerformance = true;
  errorProductPerformance: string | null = null;

  loadingSheetThickness = true;
  errorSheetThickness: string | null = null;

  // Simulate loading

  fetchChartData(): void {
    this.getPiechartData();
    this.getBarChartData();
  }
  fetchProductPerformance() {
    // Simulate API call
    setTimeout(() => {
      this.loadingProductPerformance = false;
      // this.errorProductPerformance = "Error loading product data"; // Uncomment for testing error
    }, 100);
  }

  fetchSheetThickness() {
    setTimeout(() => {
      this.loadingSheetThickness = false;
    }, 100);
  }

  ngOnInit() {
    this.getTableData(this.productionViewFlag);
    this.getPiechartData();
    this.getBarChartData();
    this.fetchProductPerformance();
    this.fetchSheetThickness();
    this.startAutoRefreshData();

    this.mockdata = [
      {
        partDescription: 'REAR FLOOR HR',
        programId: 1,
        totalSheets: 226,
        totalDefectiveSheets: 96,
        totalGoodSheets: 130,
        totalDefects: 1152,
        qualityPercentage: 57.52,
      },
      {
        partDescription: 'REAR FLOOR HR',
        programId: 1,
        totalSheets: 226,
        totalDefectiveSheets: 96,
        totalGoodSheets: 130,
        totalDefects: 1152,
        qualityPercentage: 57.52,
      },
      {
        partDescription: 'REAR FLOOR HR',
        programId: 1,
        totalSheets: 226,
        totalDefectiveSheets: 96,
        totalGoodSheets: 130,
        totalDefects: 1152,
        qualityPercentage: 57.52,
      },
    ];
  }
  startAutoRefreshData(): void {
    this.refreshShopViewData = interval(30000).subscribe(() => {
      this.getTableData(this.productionViewFlag);
      this.getPiechartData();
      this.getBarChartData();
    });
  }
  ngOnDestroy(): void {
    if (this.refreshShopViewData) {
      this.refreshShopViewData.unsubscribe();
    }
  }

  getCurrentDateTimeRange() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Create helper function to format date
    function formatDate(date: Date): string {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    let startDate = new Date();
    let endDate = new Date();

    // If current time is before 6:30 AM, go to previous day
    if (currentHour < 6 || (currentHour === 6 && currentMinute < 30)) {
      startDate.setDate(startDate.getDate() - 1); // Yesterday 6:30
      endDate = new Date(); // Today 6:30
    } else {
      endDate.setDate(endDate.getDate() + 1); // Tomorrow 6:30
    }

    // Final formatted timestamps
    const startTime = `${formatDate(startDate)} 06:30:00`;
    const endTime = `${formatDate(endDate)} 06:30:00`;

    return { startTime, endTime };
  }

  //this.defectCategoryService.getDefectCategoryData(startTime, endTime);

  getPiechartData() {
    const paramDate: any = this.getCurrentDateTimeRange();
    this.loadingPieChart = true;
    this.errorMessagePieChart = '';
    this.defectCategoryService
      .getDefectCategoryData(paramDate.startTime, paramDate.endTime)
      .pipe(delay(500))
      .subscribe({
        next: (response: any) => {
          this.piechartData = response.defectCategoryPieChartData;
          console.log('piechart data:', this.piechartData);
          this.loadingPieChart = false;
        },
        error: (err) => {
          console.error('Error fetching piechart data:', err);
          this.loadingPieChart = false;
          this.errorMessagePieChart =
            'Getting error while fetching Pie chart data';
        },
      });
  }

  getBarChartData() {
    this.chartDataFetchTime = new Date();
    const paramDate: any = this.getCurrentDateTimeRange();
    this.loadingBarchart = true;
    this.errorMessageBarchart = '';
    this.partwiseBarSummaryService
      .getBarChartData(paramDate.startTime, paramDate.endTime)
      .pipe(delay(500))
      .subscribe({
        next: (response: any) => {
          this.barchartData = response.partwiseSummuryForBarChart;
          console.log('bar chart data:', this.barchartData);
          this.loadingBarchart = false;
        },
        error: (err) => {
          console.error('Error fetching bar chart data:', err);
          this.loadingBarchart = false;
          this.errorMessageBarchart =
            'Getting error while fetching Bar chart data';
        },
      });
  }

  getTableData(isproductionView: boolean) {
    this.tableFetchTime = new Date();
    const paramDate: any = this.getCurrentDateTimeRange();
    this.shopViewService
      .getShopSummary(paramDate.startTime, paramDate.endTime, isproductionView)
      .pipe(delay(500))
      .subscribe({
        next: (response: any) => {
          this.elementData = response.shopViewSummaryList;
          console.log('table data:', this.elementData);
        },
        error: (err) => {
          console.error('Error fetching table data:', err);
        },
      });
  }

  downloadExcel(data: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Varient Summary': worksheet },
      SheetNames: ['Varient Summary'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, 'ShopView_Summary.xlsx');
  }
  downloadStyledExcel1(data: any[]) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Daily Production Report');

    // Top title row
    const titleRow = worksheet.addRow(['Daily Production Report']);
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
      'Sr.No.',
      'Machine Name',
      'Die No.',
      'Model_Name',
      'Variant_Name',
      'Coil_Code',
      'Part_Name',
      'Shift',
      'Start_Date',
      'End_Date',
      'Start Time',
      'End Time',
      'Actual production Qty',
      'Rejection_Quantity',
      'Quality %',
      'Nominal thickness',
      'Actual thickness min.',
      'Actual thickness max.',
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
    // ✅ Add auto filter to header
    worksheet.autoFilter = {
      from: 'B2',
      to: 'T2',
    };
    // ✅ Freeze top 2 rows (title + header)
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
        new Date(item.varientEndDate).toLocaleString(),
        item.actualProductionQuantity,
        item.rejectionQuantity,
        item.qualityPercentage,
        item.nominalThickness,
        item.actualThicknessMin,
        item.actualThicknessMax,
        item.inspectionResult,
      ]);
    });

    // Set column width
    (worksheet.columns as { width: number }[]).forEach(
      (column: { width: number }) => {
        column.width = 22;
      },
    );

    // Export to Excel
    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'Daily_Production_Report.xlsx');
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DownloadPopupComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);

      if (result?.fromDate && result?.toDate) {
        this.isLoading = true; // Show loader

        this.downloadService
          .getdownloadShopViewData(result.fromDate, result.toDate)
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
  //varientWiseSummury
  startSpin() {
    this.isSpinning = true;
    this.fetchChartData();
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000);
  }
  refreshDateTime() {
    this.isSpinning = true;
    this.updateDateTime();
    setTimeout(() => {
      this.isSpinning = false;
    }, 800);
  }

  updateDateTime() {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const formattedHours = String(hours).padStart(2, '0');

    this.currentDateTime = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }
}
