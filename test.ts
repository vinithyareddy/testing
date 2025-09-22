onLoadColumnChart() {
  let ChartOptions = {};
  let xAxisCategory = ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH']
  const ChartData = [
    {
      name: 'Managerial',
      data: [10, 20, 40, 50, 60, 70, 30, 80],
      color: '#71cecd',
    },
    {
      name: 'Technical',
      data: [20, 10, 50, 40, 70, 60, 50, 90],
      color: '#6b70af',
    }];

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
    dataLabelEnable: true,
  };

  // Get the chart from service
  this.swfpColumnChart = this.service.getStackedColumnChart(ChartOptions);

  // Modify chart options specifically for this component
  if (this.swfpColumnChart && this.swfpColumnChart.length > 0) {
    const chartOptions = this.swfpColumnChart[0].chartOptions;
    
    // Force the scrollablePlotArea to maintain aspect ratio
    chartOptions.chart.scrollablePlotArea = {
      minWidth: Math.max(this.cartboxchartsection.nativeElement.offsetWidth * 1.8, 1000),
      scrollPositionX: 0,
      opacity: 1
    };
    
    // Force height to stay at 330
    chartOptions.chart.height = 330;
    chartOptions.chart.plotHeight = 250; // Explicit plot height
  }

  this.responseFlag = true;
}