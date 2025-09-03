import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

type Row = { position: string; amount: number }; // amount in millions

@Component({
  selector: 'app-avg-labor-cost-position',
  templateUrl: './avg-labor-cost-position.component.html',
  styleUrls: ['./avg-labor-cost-position.component.scss']
})
export class AvgLaborCostPositionComponent {
  title = 'Average Labor Cost by Position';
  view: 'chart' | 'table' = 'chart';

  // ---- dummy data (replace later with service data) ----
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
      title: { text: 'Jobs', style: { color: '#111827', fontWeight: '500', fontSize: '13px' } },
      labels: { style: { color: '#111827', fontWeight: '600', fontSize: '12px' } },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: { text: 'Amount (in millions)', style: { color: '#111827', fontWeight: '500', fontSize: '13px' } },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        pointPadding: 0.1,
        dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
      }
    },
    series: [{
      type: 'column',
      name: 'Amount',
      pointWidth: 28,
      data: this.data.map(d => ({ name: d.position, y: d.amount }))
    }]
  };

  setView(v: 'chart' | 'table') { this.view = v; }
}


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
        <div class="togglebtn">
          <button class="toggle lft-toggle" [class.active]="view==='table'" (click)="setView('table')">
            <i class="fa fa-table fnticon" aria-hidden="true"></i>
          </button>
          <button class="toggle rgt-toggle" [class.active]="view==='chart'" (click)="setView('chart')">
            <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
          </button>
        </div>

        <button class="icon-btn" title="Zoom"><i class="fas fa-expand"></i></button>
        <button class="icon-btn" title="More"><i class="fas fa-ellipsis-v"></i></button>
      </div>
    </div>

    <!-- Body -->
    <div class="content-area">
      <ng-container *ngIf="view==='chart'">
        <highcharts-chart
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="width: 100%; height: 300px; display: block;">
        </highcharts-chart>
      </ng-container>

      <ng-container *ngIf="view==='table'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="text-start">Position</th>
                <th class="text-end">Amount (M)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of data">
                <td class="text-start">{{ r.position }}</td>
                <td class="text-end">{{ r.amount }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!data?.length" class="no-data-center">No Data Found !!</div>
        </div>
      </ng-container>
    </div>

    <!-- Footer -->
    <div class="viewmore">
      <span>View More</span>
      <i class="fa fa-angle-right"></i>
    </div>
  </div>
</div>

/* card shell */
.budget-card-box-lg { background: #fff; border-radius: 10px; }
.budget-box-chart-lg {
  border: 1px solid #d9e3ea;
  background: #f8fbfd;
  border-radius: 10px;
  padding: 12px 14px;
}

/* header */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.widget-heading {
  font-size: 14px; font-weight: 700; color: #1f2937;
  display: flex; align-items: center; gap: 6px;
  i { color: #6b7280; }
}
.header-actions { display: flex; align-items: center; gap: 8px; }

/* buttons */
.icon-btn {
  border: 1px solid #cfe0e8; background: #e8f1f5; color: #0071bc;
  width: 28px; height: 28px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
}
.togglebtn { display: inline-flex; gap: 6px; margin-right: 4px; }
.toggle {
  border: 1px solid #cfe0e8; background: #eef6fb; color: #0b6cbf;
  width: 32px; height: 28px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
}
.toggle.active { background: #d7e7ee; color: #0a4e88; border-color: #b9d3de; }
.fnticon { font-size: 14px; }

/* content */
.content-area { margin-top: 12px; }

/* table */
.table-container {
  overflow-x: auto; background: #fff; border: 1px solid #e5edf2; border-radius: 8px;
}
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead th {
  font-weight: 600; color: #374151; padding: 10px 12px; border-bottom: 1px solid #e5edf2;
}
tbody td {
  padding: 10px 12px; border-bottom: 1px solid #eef3f6; color: #111827;
}
.text-start { text-align: left; } .text-end { text-align: right; }
.no-data-center { padding: 24px; text-align: center; color: #6b7280; }

/* footer */
.viewmore { display: inline-flex; align-items: center; gap: 6px; color: #0b6cbf; font-weight: 600; margin-top: 10px; cursor: pointer; }

/* Highcharts theme tweaks to match figma */
:host ::ng-deep .highcharts-point { fill: #2d8cdf; }
:host ::ng-deep .highcharts-data-label text { font-weight: 600; fill: #111827; }
:host ::ng-deep .highcharts-axis-title, 
:host ::ng-deep .highcharts-axis-labels text { fill: #111827; }
:host ::ng-deep .highcharts-grid-line { stroke: #d1d5db; stroke-dasharray: 4; }
