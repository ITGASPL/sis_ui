import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @Input() data: { defectCategory: string; quantity: number }[] = [];

  chart: any;

  ngAfterViewInit(): void {
    if (this.data && this.data.length > 0) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  renderChart(): void {
    const ctx = document.getElementById('defectPieChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.data.map(
          (item) => `${item.defectCategory}, ${item.quantity}`,
        ),
        datasets: [
          {
            data: this.data.map((item) => item.quantity),
            backgroundColor: [
              '#FF8C00',
              '#00BFFF',
              '#32CD32',
              '#8B0000',
              '#4682B4',
              '#556B2F',
              '#FF7F50',
              '#1E90FF',
              '#9ACD32',
              '#CD5C5C',
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '                          Defects Quantity.',

            font: {
              size: 20,
              weight: 'bold',
            },
            color: '#333',
          },
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect',
              color: '#333',
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}`;
              },
            },
          },
        },
      },
    });
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.data.map(
        (item) => `${item.defectCategory}, ${item.quantity}`,
      );
      this.chart.data.datasets[0].data = this.data.map((item) => item.quantity);
      this.chart.update();
    } else {
      this.renderChart();
    }
  }
}
