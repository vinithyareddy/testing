<ng-container *ngIf="widgetType === 'linechart'">
  <div class="linechart-container">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="lineChartOptions"
      style="width: 100%; height: 350px; display: block;"
    ></highcharts-chart>
  </div>
</ng-container>


.linechart-container ::ng-deep .highcharts-legend-item .highcharts-point {
  stroke-width: 0 !important;
}

.linechart-container ::ng-deep .highcharts-legend-item:nth-child(1) .highcharts-point {
  fill: #85caf7 !important; /* Buy */
}
.linechart-container ::ng-deep .highcharts-legend-item:nth-child(2) .highcharts-point {
  fill: #a392d3 !important; /* Build */
}
.linechart-container ::ng-deep .highcharts-legend-item:nth-child(3) .highcharts-point {
  fill: #95dad9 !important; /* Borrow */
}

plotOptions: {
  line: {
    lineWidth: 2,
    marker: {
      enabled: true,
      radius: 5,
      symbol: 'circle',
      fillColor: '#fff',   // white fill for chart points
      lineWidth: 2
    }
  }
}
