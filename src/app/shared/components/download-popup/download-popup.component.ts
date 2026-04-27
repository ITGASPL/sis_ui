import { Component, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-download-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule // ✅ REQUIRED
  ],
  templateUrl: './download-popup.component.html',
  styleUrls: ['./download-popup.component.scss'],
})
export class DownloadPopupComponent {

  fromDate: Date | null = null;

  @ViewChild('picker1') picker1!: MatDatepicker<Date>;

  constructor(
    public dialogRef: MatDialogRef<DownloadPopupComponent>,
    private snackBar: MatSnackBar
  ) {}

  onDownload() {

    if (!this.fromDate) {
      this.showSnackbar('Please select date', 'error-snackbar');
      return;
    }

    const formattedFromDate =
      formatDate(this.fromDate, 'yyyy-MM-dd', 'en-US') + ' 00:06:30';

    const nextDate = new Date(this.fromDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const formattedToDate =
      formatDate(nextDate, 'yyyy-MM-dd', 'en-US') + ' 00:06:29';

    this.dialogRef.close({
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    });
  }

  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }
}