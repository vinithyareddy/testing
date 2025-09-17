import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

type Row = { grade: string; amount: number };

@Component({
  selector: 'app-avg-labor-cost-grade',
  templateUrl: './avg-labor-cost-grade.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftPopoverComponent,
    HighchartsChartModule
  ],
  styleUrls: ['./avg-labor-cost-grade.component.scss']
})
export class AvgLaborCostGradeComponent {
  Highcharts: typeof Highcharts = Highcharts;

  data: Row[] = [
    { grade: 'GI', amount: 400 },
    { grade: 'GH', amount: 330 },
    { grade: 'GG', amount: 220 },
    { grade: 'GF', amount: 150 },
    { grade: 'GE', amount: 76 }
  ];

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      spacing: [20, 20, 20, 40]
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: this.data.map(d => d.grade),
      title: {
        text: 'Grades',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      labels: { style: { color: '#111827', fontWeight: '600', fontSize: '12px' } },
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
      bar: {
        borderWidth: 0,
        pointPadding: 0.1,
        dataLabels: { enabled: true, style: { fontWeight: '600' } } as any
      }
    },
    series: [{
      type: 'bar',
      name: 'Amount',
      color: '#a392d3',
      data: this.data.map(d => d.amount)
    }]
  };

  // 🔹 new state for view + fullscreen
  currentView: 'chart' | 'table' = 'chart';
  isFullscreen = false;

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
}


<div class="budget-card-box-lg" [ngClass]="{ 'fullscreen': isFullscreen }">

  <div class="budget-box-chart-lg">

    <div class="d-flex justify-content-between align-items-center flex-wrap">

      <!-- Left Section -->
      <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
        <span class="title-with-icon d-flex align-items-center gap-2">
          Average Labor Cost by Grade
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Right Section -->
      <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">

        <!-- Toggle Buttons -->
        <div class="togglebtn d-flex">
          <div class="lft-toggle" 
               (click)="currentView = 'table'" 
               [class.active]="currentView === 'table'">
            <i class="fa fa-table fnticon" aria-hidden="true"></i>
          </div>
          <div class="rgt-toggle" 
               (click)="currentView = 'chart'" 
               [class.active]="currentView === 'chart'">
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
            <th>Grade</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data">
            <td>{{ row.grade }}</td>
            <td>{{ row.amount }}</td>
          </tr>
        </tbody>
      </table>

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


.togglebtn {
    display: flex;
    border: 1px solid #ccd5df;
    border-radius: 4px;
    overflow: hidden;
  
    .lft-toggle,
    .rgt-toggle {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #fff;
      border-right: 1px solid #ccd5df;
  
      i {
        font-size: 16px;
        color: #0071bc;
        font-weight: 400;
      }
  
      &.active {
        border: 2px solid #0071bc;
        background: #eaf4fb;
        i {
          font-weight: 600;
        }
      }
    }
  
    .rgt-toggle {
      border-right: none;
    }
  }
  
  .budget-card-box-lg.fullscreen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 9999;
    background: #fff;
    padding: 20px;
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
  
    .budget-box-chart-lg {
      height: 100%;
    }
  
    highcharts-chart, .data-table {
      height: calc(100vh - 120px) !important;
      width: 100% !important;
    }
  }
  
  .data-table {
    width: 95%;
    margin: 0 auto;
    border-collapse: collapse;
    min-height: 290px;
  
    th, td {
      border: 1px solid #ccd5df;
      padding: 8px 12px;
      text-align: left;
    }
  
    th {
      background: #f0f4f8;
      font-weight: 600;
    }
  }
  