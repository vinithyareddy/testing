<div class="chart-scroll-wrapper">
  <div class="chart-scroll-content">
    <ng-container *ngFor="let columnChart of swfpColumnChart">
      <highcharts-chart [Highcharts]="columnChart.Highcharts"
                        [options]="columnChart.chartOptions"
                        [constructorType]="columnChart.chartConstructor">
      </highcharts-chart>
    </ng-container>
  </div>
</div>


.chart-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
}

.chart-scroll-content {
  display: inline-block;
  min-width: 1200px; // adjust depending on how many bars you want visible before scrolling
}
