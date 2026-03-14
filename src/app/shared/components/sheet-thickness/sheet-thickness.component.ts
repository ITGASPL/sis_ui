import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

export interface productsData {
  id: number;
  partList: string;
  requiredThickness: number;
  actualThicknessmin: number;
  actualThicknessmax: number;
  result: string;
  test?: string;
}

@Component({
  selector: 'sheet-thickness-detection',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, CommonModule, MatPaginator],
  templateUrl: './sheet-thickness.component.html',
  styleUrls: ['./sheet-thickness.component.scss'],
})
export class SheetDetectionSheetComponent implements AfterViewInit {
  @Input() productData: productsData[] = []; // 👈 Receive data from parent
  @Input() tableFetchTime: any = '';
  displayedColumns: string[] = [
    'id',
    'partList',
    'requiredThickness',
    'actualThicknessRange',
    'result',
  ];
  dataSource = new MatTableDataSource<productsData>([]);
  isSpinning = false;
  currentDateTime: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    // Update the table when parent sends data
    this.dataSource.data = this.productData;
  }

  startSpin() {
    this.isSpinning = true;
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000);
  }

  ngOnInit() {
    this.updateDateTime();
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
