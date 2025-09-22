<div class="chart-scroll-wrapper">
  <highcharts-chart
    [Highcharts]="columnChart.Highcharts"
    [options]="columnChart.chartOptions"
    [constructorType]="columnChart.chartConstructor">
  </highcharts-chart>
</div>


.chart-scroll-wrapper {
  width: 100%;            /* wrapper uses full width */
  overflow-x: auto;       /* horizontal scroll */
  overflow-y: hidden;

  /* 👇 ensure the chart inside is wider than wrapper */
  .highcharts-container {
    min-width: 900px;     /* adjust: enough for all bars */
  }
}
