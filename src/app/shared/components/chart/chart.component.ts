import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() partData: { partDescription: string; programId: number; totalSheets:number;totalDefects:number; qualityPercentage: number; totalGoodSheets: number; totalDefectiveSheets: number; }[] = [];  // <-- Input from parent

  barChartType: 'bar' = 'bar';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Total Good Sheets',
        data: this.partData.map(p => p.totalGoodSheets),
        backgroundColor: '#00BCA1',
        hoverBackgroundColor: '#00e6b8',
        barThickness: 20
      },
       {
        label: 'Total Defective Sheets',
        data: this.partData.map(p => p.totalDefectiveSheets),
        backgroundColor: '#FF6F61',
        hoverBackgroundColor: '#ff9b94',
        barThickness: 20
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    
    scales: {
      x: {
        stacked: true,
        ticks: { color: 'black', font: { weight: 'bold' } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        stacked: true,
        ticks: { color: 'black' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
   plugins: {
    title: {
      display: true,
      text: 'Partwise Summary Data',
      align: 'center', // Use 'start', 'center', or 'end'
      font: {
        size: 18,
        weight: 'bold'
      },
      color: '#333'
    },

  
    tooltip: {
      enabled: true,
      callbacks: {
        title: (items) => {
          const i = items[0].dataIndex;
          return `Part: ${this.partData[i].partDescription}`;
        },
        label: (item) => {
          const i = item.dataIndex;
          const label = item.dataset.label;
          const value = item.formattedValue;
          return `${label}: ${value}`;
        },
        afterBody: (items) => {
          const i = items[0].dataIndex;
          const part = this.partData[i];
          return [
            `Program ID: ${part.programId}`,
            `Total Sheets: ${part.totalSheets}`,
            `Total Defects: ${part.totalDefects}`,
            `Quality: ${part.qualityPercentage}%`
          ];
        }
      }
    },
    legend: {
      labels: { color: 'black' },
      display: true
    }
  }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partData'] && this.partData && this.partData.length) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    this.barChartData = {
      labels: this.partData.map(p => p.partDescription),
      datasets: [
       {
        label: 'Total Good Sheets',
        data: this.partData.map(p => p.totalGoodSheets),
        backgroundColor: '#00BCA1',
        hoverBackgroundColor: '#00e6b8',
        barThickness: 20
      },
       {
        label: 'Total Defective Sheets',
        data: this.partData.map(p => p.totalDefectiveSheets),
        backgroundColor: '#FF6F61',
        hoverBackgroundColor: '#ff9b94',
        barThickness: 20
      }
      ]
    };
  }
}
