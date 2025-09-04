<div class="budget-card-box-lg" #cartboxchartsection>
  <div class="budget-box-chart-lg">

    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <!-- Left -->
      <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
        <span>
          Average Labor Cost by Position
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Right -->
      <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">
        <div class="togglebtn d-flex">
          <div class="lft-toggle" [class.lft-toggle-active]="widgetType == 'th'" (click)="loadWidget('th')">
            <i class="fa fa-table fnticon" aria-hidden="true"></i>
          </div>
          <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType == 'ch'" (click)="loadWidget('ch')">
            <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
          </div>
        </div>

        <div class="d-flex gap-3">
          <span class="view"><i class="fas fa-expand" title="Zoom"></i></span>
          <div class="ellipsis ml-2"><i class="fas fa-ellipsis-v"></i></div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="inner-card-box-lg mt-3">
      <div class="chart-frame">
        <ng-container *ngIf="widgetType == 'ch'">
          <div class="chart-section">
            <highcharts-chart [Highcharts]="Highcharts" [options]="chartOptions"
              style="width: 100%; height: 320px; display: block;"></highcharts-chart>
          </div>
        </ng-container>

        <ng-container *ngIf="widgetType == 'th'">
          <div class="table-row">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th class="text-start">Position</th>
                    <th class="text-end">Amount (M)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of Data">
                    <td class="text-start">{{ row.position || row.grade }}</td>
                    <td class="text-end">{{ row.amount ?? row.units }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="Data.length === 0" class="no-data-center"><span>No Data Found !!</span></div>
          </div>
        </ng-container>
      </div>
    </div>

    <div class="viewmore pointer mt-3 pt-1">
      <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="" popoverText="">
    <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>


/* OUTER CARD like Figma */
.budget-card-box-lg { background: transparent; }
.budget-box-chart-lg {
  background: #f8fbfd;
  border: 1px solid #d9e3ea;
  border-radius: 12px;
  padding: 12px 14px;
}

/* header left title */
.widget-heading span {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .far.fa-info-circle { color: #6b7280; }
}

/* header right controls */
.header-icons { gap: 10px; }

.togglebtn .lft-toggle,
.togglebtn .rgt-toggle {
  width: 32px; height: 28px;
  border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid #cfe0e8;
  background: #eef6fb;
  color: #0b6cbf; cursor: pointer;
}
.lft-toggle-active,
.rgt-toggle-active {
  background: #d7e7ee !important;
  color: #0a4e88 !important;
  border-color: #b9d3de !important;
}

.fnticon { font-size: 14px; }

.view, .ellipsis {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border: 1px solid #cfe0e8; border-radius: 6px;
  background: #e8f1f5; color: #0071bc;
}

/* INNER CHART FRAME like Figma */
.inner-card-box-lg { margin-top: 8px; }
.chart-frame {
  background: #fff;
  border: 1px solid #e5edf2;
  border-radius: 10px;
  padding: 12px;
}

/* table look */
.table-container { overflow-x: auto; }
.table-container table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table-container thead th {
  padding: 10px 12px;
  border-bottom: 1px solid #e5edf2;
  color: #374151; font-weight: 600;
}
.table-container tbody td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef3f6;
  color: #111827;
}
.text-start { text-align: left; }
.text-center { text-align: center; }
.text-end { text-align: right; }
.no-data-center { padding: 24px; text-align: center; color: #6b7280; }

/* footer */
.viewmore {
  display: inline-flex; align-items: center; gap: 6px;
  color: #0b6cbf; font-weight: 600; cursor: pointer;
}

/* ---- Highcharts theme (scoped) ---- */
:host ::ng-deep .highcharts-background { fill: transparent; }
:host ::ng-deep .highcharts-grid-line {
  stroke: #d1d5db; stroke-dasharray: 4;
}
:host ::ng-deep .highcharts-axis-title,
:host ::ng-deep .highcharts-axis-labels text {
  fill: #111827;
}
:host ::ng-deep .highcharts-point { fill: #2d8cdf; }
:host ::ng-deep .highcharts-data-label text {
  font-weight: 700; fill: #111827;
}


chartOptions: Highcharts.Options = {
  chart: { type: 'column', spacing: [10, 10, 10, 10] },
  title: { text: '' },
  credits: { enabled: false },
  legend: { enabled: false },

  xAxis: {
    categories: this.Data.map(d => (d.position ?? d.grade)),
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
      pointWidth: 28, // thicker bars like the Figma
      dataLabels: { enabled: true, style: { fontWeight: '700' } } as any
    }
  },

  series: [{
    type: 'column',
    name: 'Amount',
    data: this.Data.map(d => ({
      name: (d.position ?? d.grade),
      y: (d.amount ?? d.units)
    }))
  }]
};
