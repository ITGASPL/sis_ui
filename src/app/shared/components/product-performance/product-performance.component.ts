import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pipe, PipeTransform } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
export interface productsData {
  id: number;
  partList: string;
  actualProduction: number;
  defectQty: number;
  quality: string;
}

@Component({
  selector: 'app-product-performance',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    DatePipe,
    MatPaginator,
    MatTooltipModule,
  ],
  templateUrl: './product-performance.component.html',
  styleUrls: ['./product-performance.component.scss'],
})
export class AppProductPerformanceComponent
  implements AfterViewInit, OnChanges
{
  @Input() productPerformanceData: productsData[] = []; // 👈 Receive data from parent
  @Input() tableFetchTime: any = '';
  @Output() fetchtableData = new EventEmitter<Event>();
  displayedColumns: string[] = [
    'id',
    'partList',
    'actualProduction',
    'defectQty',
    'quality',
  ];
  dataSource = new MatTableDataSource<productsData>([]);
  isSpinning = false;
  currentDateTime: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productPerformanceData']) {
      this.dataSource.data = this.productPerformanceData;
    }
  }
  startSpin() {
    this.isSpinning = true;
    this.fetchtableData.emit();
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
