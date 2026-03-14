import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface productsData {
  id: number;
  sheet: string;
  image: string;
  thickness: number;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    sheet: 'Sheet1',
    image: '',
    thickness: 1.75,
  },
  {
    id: 2,
    sheet: 'Sheet2',
    image: '',
    thickness: 1.82,
  },
  {
    id: 3,
    sheet: 'Sheet3',
    image: '',
    thickness: 1.73,
  },
  {
    id: 4,
    sheet: 'Sheet4',
    image: '',
    thickness: 1.69,
  },
  {
    id: 5,
    sheet: 'Sheet5',
    image: '',
    thickness: 1.74,
  },
  {
    id: 6,
    sheet: 'Sheet6',
    image: '',
    thickness: 1.72,
  },
];

@Component({
  selector: 'inspection-data',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, CommonModule],
  templateUrl: './production-sheet.component.html',
})
export class InspectionSheetComponent {
  displayedColumns: string[] = ['No', 'Sheet', 'Image', 'Thickness'];

  dataSource = ELEMENT_DATA;
}
