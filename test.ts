<div class="budget-card-box-lg" #cartboxchartsection [ngClass]="{ 'fullscreen': isFullscreen }">

  <div class="budget-box-chart-lg">

    <div class="d-flex justify-content-between align-items-center flex-wrap">

      <!-- Left Section -->
      <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
        <span>
          Average Labor Cost by Position
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Right Section -->
      <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">

        <!-- Toggle Buttons -->
        <div class="togglebtn d-flex">
          <div class="lft-toggle" (click)="currentView = 'table'">
            <i class="fa fa-table fnticon" aria-hidden="true"></i>
          </div>
          <div class="rgt-toggle" (click)="currentView = 'chart'">
            <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
          </div>
        </div>

        <div class="d-flex gap-3">
          <span class="view" (click)="toggleFullscreen()">
            <i [ngClass]="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'" title="Zoom"></i>
          </span>
          <div class="ellipsis ml-2">
            <i class="fas fa-ellipsis-v"></i>
          </div>
        </div>

      </div>
    </div>

    <!-- Chart / Table Section -->
    <div class="content-area">

      <button class="nav-arrow left-arrow" (click)="prevItem()">
        <i class="fa fa-chevron-left"></i>
      </button>

      <!-- Chart -->
      <highcharts-chart *ngIf="currentView === 'chart'"
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        style="width: 95%; height: 290px; display: block;">
      </highcharts-chart>

      <!-- Table -->
      <table *ngIf="currentView === 'table'" class="data-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data">
            <td>{{ row.position }}</td>
            <td>{{ row.amount }}</td>
          </tr>
        </tbody>
      </table>

      <button class="nav-arrow right-arrow" (click)="nextItem()">
        <i class="fa fa-chevron-right"></i>
      </button>

    </div>

    <div class="viewmore pointer mt-3 pt-3">
      <span>View More&nbsp;&nbsp;</span>
      <i class="fa fa-angle-right"></i>
    </div>

  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="" popoverText="">
    <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>



import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

type Row = { position: string; amount: number };

@Component({
  selector: 'app-avg-labor-cost-position',
  templateUrl: './avg-labor-cost-position.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftPopoverComponent,
    HighchartsChartModule
  ],
  styleUrls: ['./avg-labor-cost-position.component.scss']
})
export class AvgLaborCostPositionComponent {
  title = 'Average Labor Cost by Position';

  data: Row[] = [
    { position: 'GG-Education Specialist Senior', amount: 320 },
    { position: 'GF-Education Specialist', amount: 218 },
    { position: 'GF-Economist', amount: 178 },
    { position: 'GF-Operational Specialist', amount: 102 },
    { position: 'GF-Energy Consultant', amount: 74 }
  ];

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      spacing: [20, 20, 20, 40]
    },
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
      tickInterval: 50,
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
        pointWidth: 20,
        dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
      }
    },
    series: [{
      type: 'column',
      name: 'Amount',
      color: '#85caf7',
      data: this.data.map((d, i) => ({
        name: d.position,
        y: d.amount,
        dataLabels: i === 0 ? {
          enabled: true,
          verticalAlign: 'bottom',
          align: 'center',
          y: -6,
          style: { fontWeight: '700', color: '#111827' }
        } : {}
      })),
      dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
    }]
  };

  // 🔹 New additions
  currentView: 'chart' | 'table' = 'chart';
  isFullscreen = false;
  currentIndex = 0;

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  prevItem() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateChart();
    }
  }

  nextItem() {
    if (this.currentIndex < this.data.length - 1) {
      this.currentIndex++;
      this.updateChart();
    }
  }

  updateChart() {
    this.chartOptions = {
      ...this.chartOptions,
      xAxis: { categories: [this.data[this.currentIndex].position] },
      series: [{
        type: 'column',
        data: [this.data[this.currentIndex].amount],
        color: '#85caf7'
      }]
    };
  }
}
