import {
  Component,
  Inject,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-inspection-popupview',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './inspection-popupview.component.html',
  styleUrls: ['./inspection-popupview.component.scss'],
})
export class InspectionPopupViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InspectionPopupViewComponent>,
  ) {}
  zoomLevel = 1;
  transform = 'scale(1)';
  pairs: any[][] = [];
  isLoading = false;
  loOffsetX = 90;
  ngOnInit() {
    this.pairs = this.getPairs(this.data.sheetxydata);
  }

  ngOnDestroy(): void {
    this.zoomLevel = 1;
    this.transform = 'scale(1)';
    this.pairs = [];
    this.isLoading = true;

    if (this.data) {
      this.data.imageUrl = null;
      this.data.cuttingImageUrl = null;
      this.data.sheetxydata = null;
      this.data.selectedRowData = null;
    }
  }
  zoomIn(): void {
    this.zoomLevel += 0.1;
    this.updateTransform();
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1;
      this.updateTransform();
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.updateTransform();
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) this.zoomIn();
    else this.zoomOut();
  }

  updateTransform(): void {
    this.transform = `scale(${this.zoomLevel})`;
  }
  closePopup(): void {
    this.dialogRef.close();
  }

  getPairs(arr: any[]): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += 2) {
      result.push([arr[i], arr[i + 1]]);
    }
    return result;
  }
}
