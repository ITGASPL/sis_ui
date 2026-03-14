import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-download-popup',
  imports: [
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDatepicker,
    MatNativeDateModule,
  ],
  templateUrl: './download-popup.component.html',
  styleUrl: './download-popup.component.scss',
})
export class DownloadPopupComponent {
  fromDate: Date | null = null;
  toDate: Date | null = null;

  @ViewChild('picker1') picker1!: MatDatepicker<Date>;
  @ViewChild('picker2') picker2!: MatDatepicker<Date>;
  constructor(public dialogRef: MatDialogRef<DownloadPopupComponent>) {}

  onDownload() {
    const formattedFromDate = this.fromDate
      ? formatDate(this.fromDate, 'yyyy-MM-dd', 'en-US') + ' 00:06:30'
      : null;
    const nextDate = this.fromDate ? new Date(this.fromDate) : null;
    if (nextDate) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    const formattedToDate = nextDate
      ? formatDate(nextDate, 'yyyy-MM-dd', 'en-US') + ' 00:06:29'
      : null;
    //const formattedToDate = this.toDate ? formatDate(this.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-US') : null;
    this.dialogRef.close({
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    });
  }
}
