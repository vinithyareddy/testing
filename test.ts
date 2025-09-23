onLoadColumnChart() {
  let ChartOptions = {};
  let xAxisCategory = ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH'];
  const ChartData = [
    { name: 'Managerial', data: [10, 20, 40, 50, 60, 70, 30, 80], color: '#71cecd' },
    { name: 'Technical', data: [20, 10, 50, 40, 70, 60, 50, 90], color: '#6b70af' }
  ];

  ChartOptions = {
    chartWidth: this.cartboxchartsection.nativeElement.offsetWidth - 40,
    chartHeight: 330,
    xAxisCategory: xAxisCategory,
    legendVisible: false,
    dataseries: ChartData,
    xAxisVisible: true,
    yAxisVisible: true,
    xAxisTitle: 'Grade',
    yAxisTitle: 'Percentage',
    dataLabelEnable: true
  };

  // get base chart config from service
  this.swfpColumnChart = this.service.getStackedColumnChart(ChartOptions);

  // 👉 apply scroll customization ONLY here
  const chartOpts = this.swfpColumnChart[0].chartOptions;
  chartOpts.chart = {
    ...chartOpts.chart,
    spacingLeft: 0
  };
  (chartOpts.yAxis as Highcharts.YAxisOptions[])[0].labels = {
    ...(chartOpts.yAxis as Highcharts.YAxisOptions[])[0].labels,
    x: -50
  };

  this.responseFlag = true;
}


.chart-wrapper {
  position: relative;
  overflow: hidden;
}

.chart-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-left: 60px; // space for Y-axis
}

.chart-scroll highcharts-chart {
  display: block;
  min-width: 1200px; // chart is wider, so it scrolls
}
