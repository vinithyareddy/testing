<div class="budget-card-box-lg">
  <div class="budget-box-chart-lg">

    <!-- Header -->
    <div class="header-row">
      <div class="widget-heading">
        <span>{{ title }}
          <lift-popover popoverTitle="" popoverText="">
            <i class="far fa-info-circle ml-1"></i>
          </lift-popover>
        </span>
      </div>

      <div class="header-actions">
        <button class="icon-btn"><i class="fas fa-expand"></i></button>
        <button class="icon-btn"><i class="fas fa-ellipsis-v"></i></button>
      </div>
    </div>

    <!-- Chart -->
    <div class="content-area">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        style="width: 100%; height: 300px; display: block;">
      </highcharts-chart>
    </div>

    <!-- Footer -->
    <div class="viewmore">
      <span>View More</span>
      <i class="fa fa-angle-right"></i>
    </div>

  </div>
</div>


.budget-card-box-lg {
  background: #fff;
  border-radius: 10px;
}

.budget-box-chart-lg {
  border: 1px solid #d9e3ea;
  background: #f8fbfd;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.widget-heading {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 6px;

  i { color: #6b7280; }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  border: 1px solid #cfe0e8;
  background: #e8f1f5;
  color: #0071bc;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.content-area { margin-top: 12px; }

.viewmore {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0b6cbf;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
}

/* Highcharts theming */
:host ::ng-deep .highcharts-point {
  fill: #2d8cdf;
}

:host ::ng-deep .highcharts-data-label text {
  font-weight: 600;
  fill: #111827;
}

:host ::ng-deep .highcharts-axis-title,
:host ::ng-deep .highcharts-axis-labels text {
  fill: #111827;
}

:host ::ng-deep .highcharts-grid-line {
  stroke: #d1d5db;
  stroke-dasharray: 4;
}


import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

type Row = { position: string; amount: number };

@Component({
  selector: 'app-avg-labor-cost-position',
  templateUrl: './avg-labor-cost-position.component.html',
  styleUrls: ['./avg-labor-cost-position.component.scss']
})
export class AvgLaborCostPositionComponent {
  title = 'Average Labor Cost by Position';

  // dummy data for now (replace with API later)
  data: Row[] = [
    { position: 'GG-Education Specialist Senior', amount: 320 },
    { position: 'GF-Education Specialist', amount: 218 },
    { position: 'GF-Economist', amount: 178 },
    { position: 'GF-Operational Specialist', amount: 102 },
    { position: 'GF-Energy Consultant', amount: 74 }
  ];

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: this.data.map(d => d.position),
      title: {
        text: 'Jobs',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Amount (in millions)',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        pointPadding: 0.1,
        pointWidth: 28,
        dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
      }
    },
    series: [{
      type: 'column',
      name: 'Amount',
      data: this.data.map(d => ({ name: d.position, y: d.amount }))
    }]
  };
}
