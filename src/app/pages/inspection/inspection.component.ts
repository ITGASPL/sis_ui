import { MaterialModule } from 'src/app/material.module';
import { InspectionSheetComponent } from 'src/app/shared/components/production-sheet/production-sheet.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { delay } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { DownloadPopupComponent } from 'src/app/shared/components/download-popup/download-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MachineLiveStatusComponent } from 'src/app/shared/components/machine-live-status/machine-live-status.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/websocket.service';
import {
  Subscription,
  throwError,
  Observable,
  of,
  interval,
  forkJoin,
  Subject,
  EMPTY,
} from 'rxjs';
import {
  startWith,
  switchMap,
  takeUntil,
  tap,
  catchError,
  sampleTime,
} from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductionViewCurrentDyeSummaryService } from './services/summarryForCurrentDye.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CurrentRecipeInformationService } from './services/currentRecipeInformation.service';
import { AllNGSheetCurrentDyeService } from './services/allNGSheetCuttentDyeService.service';
import { InspectionTableComponent } from 'src/app/shared/components/inspection-table/inspection-table.component';
import { DownloadReportsDataService } from 'src/app/core/services/download-reports.service';
import { saveAs } from 'file-saver'; // For saving file
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Workbook, Worksheet } from 'exceljs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface Defect {
  x: number;
  y: number;
  type: number;
}

export interface WebSocketData {
  valid: number;
  incrementalId: number;
  programId: number;
  variantCode: number;
  cameraId: number;
  sheetCount: number;
  width: number;
  height: number;
  cameraStatus: boolean;
  defectCount: number;
  defects: Defect[];
  timestamp: string;
  thickness: number;
  defectNames: any;
}

@Component({
  selector: 'inspection-page',
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    InspectionTableComponent,
    MatDatepickerModule,
    MatProgressBarModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MaterialModule,
    MachineLiveStatusComponent,
    MatSnackBarModule 
  ],
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss'],
})
export class InspectionComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private destroy$ = new Subject<any>();

  cuttingImageUrl1: any;
  cuttingImageUrl2: any;
  summaryData: any;
  currentDyeData: any;

  cameraY = [492, 402, 312, 222, 132, 42];
  points: any[] = [];
  batchData: any = {};
  isSpinning = false;
  currentSheetdefectNames: any;
  oldSheetNumber: number = 0;
  OverallStatus: boolean = false;
  downloadedData: any = [];
  isLoading = false;
  currentRecipeData: any = {};
  variantType: string = '';
  latestData: any;
  message = '';
  dataHistory: any[] = [];

  parsedRows: any[] = [];
  leftOffset1: number = 0;
  leftOffset2: number = 0;
  depthOffset: number = 0;
  cameraPacketData: WebSocketData[] = [];
  public updateIndex: number = 0;
  currentShift: string = '';
  intervalRef: any;
  defectTypes: string[] = [
    'Blank Short',
    'Rust',
    'Burr',
    'Scratch Mark',
    'Pimple',
    'Dimple',
    'Roller Marker',
    'Lamination',
    'Blackrust Patch',
    'Sheet Waveness',
    'Pin Hole Mark',
    'Line Mark',
    'Scale Mark',
    'Pitting',
    '',
  ];
  lastUpdated = '09/04/2025 11:30 AM';

  sites = ['SMG', 'XYZ'];
  locations = ['Gujrat', 'Delhi'];
  plants = ['PLT-A', 'PLT-B'];
  shops = ['Press-Shop', 'Assembly'];
  private refreshSub!: Subscription;
  selectedSite = this.sites[0];
  selectedLocation = this.locations[0];
  selectedPlant = this.plants[0];
  selectedShop = this.shops[0];
  getCurrentDyeDataTime: Date = new Date();
  previousProgramNumber: number | null = null;
  isProgramChanged = false;
currentProgramNumber: number | null = null;
isWaitingForNewProgramData = false;
lastSheetNumberAtProgramChange: number | null = null;
lastKnownNgSheetNumber: number | null = null;



  constructor(
    private dialog: MatDialog,
    private productionViewCurrentDyeSummaryService: ProductionViewCurrentDyeSummaryService,
    private allNGSheetCurrentDyeService: AllNGSheetCurrentDyeService,
    private downloadSheetWiseDataService: DownloadReportsDataService,
    private wsService: WebsocketService,
    private currentRecipeInformationService: CurrentRecipeInformationService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) {}
showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }
  items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

  showDownloadPopup = false;
  toggleDownload() {
    this.showDownloadPopup = !this.showDownloadPopup;
  }
  updateShift() {
    this.currentShift = this.getShift();
  }

  getShift(): string {
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    if (m >= 390 && m <= 914) return 'A';

    if (m >= 915 && m <= 1439) return 'B';

    return 'C';
  }

async downloadStyledExcel1(data: any[]) {

  try {

    const workbook = new Workbook();

    const templatePath =
      window.location.origin +
      '/surface_system/assets/templates/Sheet_Wise_Summary_Template.xlsx';

    const response = await fetch(templatePath);

    if (!response.ok) {
      this.showSnackbar('Template not found', 'error-snackbar');
      return;
    }

    const buffer = await response.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1) as Worksheet;

    let rowIndex = 3;

    data.forEach((item, index) => {

      const row = worksheet.getRow(rowIndex);

      row.getCell(1).value = index + 1;
      row.getCell(2).value = item.equipmentNAme || '';
      row.getCell(3).value = item.modelId || '';
      row.getCell(4).value = item.modelName || '';
      row.getCell(5).value = item.varientName || '';
      row.getCell(6).value = item.programNumber || '';
      row.getCell(7).value = item.coildCode || '';
      row.getCell(8).value = item.partName || '';
      row.getCell(9).value = item.shift || '';
      row.getCell(10).value = item.reportStartDate
        ? new Date(item.reportStartDate).toLocaleString()
        : '';
      row.getCell(11).value = item.reportEndDate
        ? new Date(item.reportEndDate).toLocaleString()
        : '';
      row.getCell(12).value = item.rejectionLogTime
        ? new Date(item.rejectionLogTime).toLocaleString()
        : '';
      row.getCell(13).value = item.rejectionQuantity || '';
      row.getCell(14).value = item.sheetNumber || '';
      row.getCell(15).value = item.inspectionResult || '';
      row.getCell(16).value = item.operatorDefectTypes || '';

      row.commit();
      rowIndex++;
    });

    const outBuffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([outBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(blob, 'Sheetwise_Summary_Report.xlsx');

    // ✅ SUCCESS TOAST HERE
    this.showSnackbar('Download completed successfully', 'success-snackbar');

  } catch (err) {

    console.error(err);

    // ❌ ERROR TOAST
    this.showSnackbar('Download failed', 'error-snackbar');
  }
}

  openDialog() {
    const dialogRef = this.dialog.open(DownloadPopupComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);

      if (result?.fromDate && result?.toDate) {
        this.isLoading = true;

        this.downloadSheetWiseDataService
          .getdownloadSheetSummaryData(result.fromDate, result.toDate)
          .subscribe({
            next: (res) => {
              this.downloadedData = res.sheetWiseSummury
                ? res.sheetWiseSummury
                : [];

              this.downloadStyledExcel1(this.downloadedData);
            },
            error: (err) => {
              console.error(err);
              this.isLoading = false;
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      }
    });
  }

  startSpin() {
    this.isSpinning = true;
    this.getAllNgSheetsForCurrentDyeData();
    this.getCurrentDyeData();
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000);
  }

  ngOnInit(): void {
    this.updateShift();

    this.intervalRef = setInterval(() => {
      this.updateShift();
    }, 60000);
    this.getAllNgSheetsForCurrentDyeData();
    this.getCurrentDyeData();
    this.getCurrentRecipeInformationData();
    this.startAutoRefresh();

    this.subscription = this.wsService
      .connect('ws://192.168.4.100:8080/ws/messages')
      .pipe(sampleTime(200))
      .subscribe((data) => {
        if (data) {
          const parsed = this.parseData(data);

          if (parsed) {
            this.latestData = parsed;
          }
        }
      });
  }

getCurrentRecipeInformationData(): Observable<any> {
  return this.currentRecipeInformationService
    .getCurrentRecipeInformationData()
    .pipe(
      tap((response: any) => {

        const newProgram =
          response?.vartiantMasterDTO?.programDto?.programNumber;

        // 🔥 Detect program change
        if (
          this.currentProgramNumber !== null &&
          this.currentProgramNumber !== newProgram
        ) {
          console.log('Program changed → clearing & blocking old NG');

          // ✅ Store last visible NG sheet BEFORE clearing
          this.lastKnownNgSheetNumber =
            this.summaryData?.[0]?.sheetNumber || null;

          // ✅ Clear table
          this.summaryData = [];

          // 🔒 Block old NG data
          this.isWaitingForNewProgramData = true;
        }

        // ✅ Update program
        this.currentProgramNumber = newProgram;

        // ===== Existing code (unchanged) =====
        this.currentRecipeData = response;

        this.leftOffset1 = response.vartiantMasterDTO.lo1 || 0;

        const base64Data1 = response.vartiantMasterDTO.recipeProfile1;
        const objectURL1 = `data:image/bmp;base64,${base64Data1}`;
        this.cuttingImageUrl1 =
          this.sanitizer.bypassSecurityTrustUrl(objectURL1);

        this.depthOffset = response.vartiantMasterDTO.depthOffset || 0;
        this.variantType = response?.vartiantMasterDTO?.varientType;

        if (this.variantType === 'Oscillator') {
          this.leftOffset2 = response.vartiantMasterDTO.lo2 || 0;

          const base64Data2 = response.vartiantMasterDTO.recipeProfile2;
          const objectURL2 = `data:image/bmp;base64,${base64Data2}`;
          this.cuttingImageUrl2 =
            this.sanitizer.bypassSecurityTrustUrl(objectURL2);
        }
      }),
      catchError((err) => {
        console.error('Error fetching recipe info:', err);
        return EMPTY;
      })
    );
}

  startAutoRefresh(): void {
    interval(4000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(() =>
          this.getAllNgSheetsForCurrentDyeData().pipe(
            catchError((err) => {
              console.error('Sheets API error:', err);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe({
        next: (sheets) => {},
        error: (err) => console.error('Sheets refresh failed:', err),
      });


      interval(1000) // ✅ every 1 second
  .pipe(
    startWith(0),
    takeUntil(this.destroy$),
    switchMap(() =>
      this.getCurrentRecipeInformationData().pipe(
        catchError((err) => {
          console.error('Program Details API error:', err);
          return EMPTY;
        })
      )
    )
  )
  .subscribe();

    interval(30000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(() =>
          this.getCurrentDyeData().pipe(
            catchError((err) => {
              console.error('Current API error:', err);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe({
        next: (current) => {},
        error: (err) => console.error('Current refresh failed:', err),
      });
  }

getAllNgSheetsForCurrentDyeData(): Observable<any> {
  return this.allNGSheetCurrentDyeService.getAllNGSheetCurrentDye().pipe(
    tap((res: any) => {

      const list = res?.listOfSheetWiseSummuryDto || [];

      // 🔒 WAIT MODE after program change
      if (this.isWaitingForNewProgramData) {

        if (list.length === 0) {
          this.summaryData = [];
          return;
        }

        const latestSheet = list[0]?.sheetNumber;

        // ❌ Still old data → ignore
        if (
          this.lastKnownNgSheetNumber !== null &&
          latestSheet === this.lastKnownNgSheetNumber
        ) {
          console.log('Old NG data → ignored');
          this.summaryData = [];
          return;
        }

        // ✅ New NG detected
        console.log('New NG detected → showing table');

        this.isWaitingForNewProgramData = false;
        this.summaryData = list;

        return;
      }

      // ✅ Normal flow
      this.summaryData = list;
    }),
    catchError((err) => {
      console.error('Error fetching NG Sheet data:', err);
      return of(null);
    }),
  );
}

  getCurrentDyeData() {
    this.getCurrentDyeDataTime = new Date();

    return this.productionViewCurrentDyeSummaryService
      .getProductionViewCurrentDyeSummary()
      .pipe(
        tap((response: any) => {
          this.currentDyeData = response.productionViewCurrentDyeSummury;
        }),
        catchError((err: any) => {
          console.error('Error fetching get current dye data:', err);
          return throwError(() => err);
        }),
      );
  }
  sendMessage() {
    this.wsService.send({ message: this.message });
    this.message = '';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
    this.wsService.close();
    this.destroy$.next(null);
    this.destroy$.complete();
  }
  parseData(data: string): {
    [cameraId: number]: boolean;
    overallStatus: boolean;
    defectNames?: string[];
    sheetThickness?: number;
    sheetCount?: number;
    timestamp?: string;
    points?: { x: number; y: number }[];
  } | null {
    const statusMap: Record<number, boolean> = {};
    const defectNameSet = new Set<string>();
    const points: { x: number; y: number }[] = [];
    const defectTypes = this.defectTypes;

    let allOk = true;
    let sheetThickness: number | undefined;
    let sheetCount: number | undefined;
    let timestamp: string | undefined;

    if (data.startsWith('4')) {
      this.getCurrentRecipeInformationData();
      return null;
    }

    const records = data.split('#');

    for (const record of records) {
      if (!record.trim()) continue;

      const clean =
        record[0] === '*' || record[0] === '#' ? record.slice(1) : record;

      const parts = clean.split(',', 13); // limit split for better performance

      if (parts.length < 13) continue;

      const cameraId = +parts[4];
      const cameraStatus = !!+parts[8];
      const defectCount = +parts[9];
      const defectString = parts[10];

      statusMap[cameraId] = cameraStatus;
      if (!cameraStatus) allOk = false;

      if (sheetThickness === undefined) {
        sheetThickness = parseFloat(parts[12]);
        const sheetNumPart = parts[5]?.split('_')[1];
        sheetCount = sheetNumPart ? +sheetNumPart : undefined;
        timestamp = parts[11] ? this.formatCustomDate(parts[11]) : '—';
      }

      if (defectCount > 0 && defectString !== 'NA') {
        const defects = defectString.split(';');
        for (const defect of defects) {
          const defectValues = defect.split(':');

          const xPixel = Number(defectValues[1]) / 1.50784;
          const LoOffset =
            this.variantType === 'Oscillator' &&
            (sheetCount ? sheetCount % 2 !== 0 : false)
              ? this.leftOffset2 
              : this.leftOffset1;
          const x = xPixel / 1.6 + LoOffset / 1.6;
          const y = this.cameraY[cameraId - 1] + this.depthOffset;
          const type = defectValues[2];
          const name = defectTypes[Number(type) - 1];

          points.push({ x, y });

          if (name) defectNameSet.add(name);
        }
      }
    }

    const result: {
      [cameraId: number]: boolean;
      overallStatus: boolean;
      defectNames?: string[];
      sheetThickness?: number;
      sheetCount?: number;
      timestamp?: string;
      points?: { x: number; y: number }[];
    } = {
      ...statusMap,
      overallStatus: allOk,
      sheetThickness,
      sheetCount,
      timestamp,
    };

    if (defectNameSet.size > 0) {
      result.defectNames = Array.from(defectNameSet);
    }

    if (points.length > 0) {
      result.points = points;
      console.log('Points:', points);
    }

    return result;
  }

  formatCustomDate(rawTimestamp: string): string {
    const year = parseInt(rawTimestamp.slice(0, 4));
    const month = parseInt(rawTimestamp.slice(4, 6)) - 1;
    const day = parseInt(rawTimestamp.slice(6, 8));
    const hour = parseInt(rawTimestamp.slice(8, 10));
    const minute = parseInt(rawTimestamp.slice(10, 12));
    const second = parseInt(rawTimestamp.slice(12, 14));
    const millisecond = parseInt(rawTimestamp.slice(14, 17));

    const date = new Date(year, month, day, hour, minute, second, millisecond);

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const formattedDate = `${String(day).padStart(2, '0')}-${String(
      month + 1,
    ).padStart(2, '0')}-${year}`;
    const formattedTime = date.toLocaleTimeString('en-US', options);

    return `${formattedDate} | ${formattedTime}`;
  }
  getCurrentDate(): string {
    const today = new Date();
    const day1 = String(today.getDate()).padStart(2, '0');
    const month1 = String(today.getMonth() + 1).padStart(2, '0');
    const year1 = today.getFullYear();
    return `${day1}-${month1}-${year1}`;
  }
}
