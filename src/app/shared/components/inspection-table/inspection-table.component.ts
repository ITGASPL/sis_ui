import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StitchedImageService } from 'src/app/core/services/stitchedImage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { InspectionPopupViewComponent } from '../inspection-popupview/inspection-popupview.component';
import { forkJoin } from 'rxjs';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
export interface PageEvent {
  pageIndex: number; // The index of the current page (starts at 0)
  pageSize: number; // The number of items per page
  length: number; // The total number of items across all pages
  previousPageIndex?: number; // The index of the previous page
}
interface DefectSummary {
  defectCode: number;
  defectName: string;
  xCoordinate: number;
  yCoordinate: number;
  xSheetwise: number;
  ySheetwise: number;
  cameraId: number;
  cameraName: string;
  defectLogTime: number; // timestamp (epoch ms)
}
@Component({
  selector: 'app-inspection-table',
  standalone: true,
  imports: [
    MaterialModule,
    MatDialogModule,
    CommonModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './inspection-table.component.html',
  styleUrl: './inspection-table.component.scss',
})
export class InspectionTableComponent implements OnChanges {
  constructor(
    private stitchedImageService: StitchedImageService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) {}
  @Input() inspectionTableData: any[] = []; // 👈 Receive data from parent
  @Input() cuttingImageUrlLink1: any;
  @Input() cuttingImageUrlLink2: any;
  @Input() variantType: string = '';
  @Input() leftOffset1: number = 0;
  @Input() leftOffset2: number = 0;
  //  @Input() tableFetchTime:any = "";
  displayedColumns: string[] = [
    'srNo',
    'sheetNumber',
    'operatorDefectTypes',
    'sheetThickness',
    'inspectionResult',
    'imageProcessFlag',
  ];

  dataSource = new MatTableDataSource<any>([]);
  isSpinning = false;
  currentDateTime: string = '';
  selectedRowData: any = null;
  pageIndex = 0;
  pageSize = 6;
  imageUrl: any;
  sheetxydata: DefectSummary[] = [];
  partName: string = '';
  loadingImage = false;
  stitchWidth: number = 0;
  stitchHeight: number = 0;
  isLoading = false;
  finalcuttingImageUrlLink: any;
  finalloffset: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  openPopup(rowData: any | null): void {
    console.log('Row data:', rowData);
    const sheetId = rowData?.sheetId;
    this.selectedRowData = rowData ?? {};
    this.isLoading = true; // ✅ show loading spinner
    if (this.variantType === 'Oscillator' && sheetId % 2 === 0) {
      this.finalcuttingImageUrlLink = this.cuttingImageUrlLink1;
      this.finalloffset = this.leftOffset1 * 0.38;
    } else if (this.variantType === 'Oscillator' && sheetId % 2 !== 0) {
      this.finalcuttingImageUrlLink = this.cuttingImageUrlLink2;
      this.finalloffset = this.leftOffset2 * 0.38;
    } else {
      this.finalcuttingImageUrlLink = this.cuttingImageUrlLink1;
      this.finalloffset = this.leftOffset1;
    }
    // 🔹 Wait for both APIs to complete
    forkJoin({
      stitchedImage: this.getStitchedImage(sheetId),
      xyCoordinates: this.getxyCoordinates(sheetId),
    }).subscribe({
      next: (results) => {
        // ✅ Both responses are ready
        this.imageUrl = results.stitchedImage;
        this.sheetxydata = results.xyCoordinates;

        // ✅ Open the popup with complete data
        this.dialog.open(InspectionPopupViewComponent, {
          width: '95vw',
          maxWidth: 'none',
          height: '95vh',
          panelClass: 'inspection-popupview',
          disableClose: true,
          data: {
            selectedRowData: this.selectedRowData,
            imageUrl: this.imageUrl,
            cuttingImageUrl: this.finalcuttingImageUrlLink,
            leftOffset: this.finalloffset,
            variantType: this.variantType,
            sheetxydata: this.sheetxydata,
            stitchWidth: this.stitchWidth,
            stitchHeight: this.stitchHeight,
            partName: this.partName,
          },
        });

        this.isLoading = false; // ✅ hide loader
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false; // hide loader even if error
      },
    });
  }
  closePopup(): void {
    this.selectedRowData = null;
    this.imageUrl = null;
    this.sheetxydata = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inspectionTableData'] && this.inspectionTableData) {
      this.dataSource.data = this.inspectionTableData;

      // Ensure paginator is updated after data is set
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    });
  }
  getStitchedImage(sheetId: any): Observable<any> {
    this.loadingImage = true;
    return this.stitchedImageService.getStitchedImage(sheetId).pipe(
      map((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        const imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.loadingImage = false;

        return imageUrl; // ✅ Return the final image URL
      }),
      catchError((err) => {
        console.error('Error fetching Stitched Image:', err);
        this.loadingImage = false;
        return of(null);
      }),
    );
  }

  getxyCoordinates(sheetId: any): Observable<any[]> {
    return this.stitchedImageService.getXYCoordinates(sheetId).pipe(
      map((res: any) => {
        const data = res.stichedImagePopupInformation.listOfDefectSummuries;
        this.partName = res.stichedImagePopupInformation.variantName;

        return data;
      }),
      catchError((err) => {
        console.error('Error fetching XY Coordinates:', err);
        return of([]); // return empty array to prevent errors
      }),
    );
  }
}
