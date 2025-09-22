<div class="chart-scroll-wrapper">
  <highcharts-chart
    [Highcharts]="columnChart.Highcharts"
    [options]="columnChart.chartOptions"
    [constructorType]="columnChart.chartConstructor"
    style="width: 100%; display: block;">
  </highcharts-chart>
</div>

.chart-scroll-wrapper {
  width: 100%;        /* visible width of widget */
  max-width: 600px;   /* 👈 fit ~5 bars here */
  overflow-x: auto;   /* horizontal scrollbar */
  overflow-y: hidden;
}

:host ::ng-deep .highcharts-container {
  height: 100% !important;
}


onLoadColumnChart() {
  const categories = ['GA','GB','GC','GD','GE','GF','GG','GH'];

  const ChartData = [
    { name: 'Managerial', data: [10,20,40,50,60,70,30,80], color: '#71cecd' },
    { name: 'Technical', data: [20,10,50,40,70,60,50,90], color: '#6b70af' }
  ];

  const barWidth = 120; // px per category
  const totalWidth = categories.length * barWidth;

  const ChartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      width: totalWidth,   // 👈 wider than wrapper, triggers scroll
      height: 330,
      backgroundColor: '#fff'
    },
    title: { text: 'Work Force Supply' },
    xAxis: {
      categories,
      title: { text: 'Grade' }
    },
    yAxis: {
      title: { text: 'Percentage' }
    },
    series: ChartData as any,
    legend: { enabled: false },
    plotOptions: {
      column: { dataLabels: { enabled: true } }
    }
  };

  this.swfpColumnChart = [{
    Highcharts: this.service.Highcharts,
    chartConstructor: 'chart',
    chartOptions: ChartOptions
  }];
  this.responseFlag = true;
}
