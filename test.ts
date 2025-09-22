// Replace your existing onLoadColumnChart() method with this:
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

  // Get the base chart from service
  this.swfpColumnChart = this.service.getStackedColumnChart(ChartOptions);
  
  // Modify the chart options specifically for this widget to add scrolling
  if (this.swfpColumnChart && this.swfpColumnChart.length > 0) {
    const chartOptions = this.swfpColumnChart[0].chartOptions;
    
    // Add scrollable plot area
    chartOptions.chart.scrollablePlotArea = {
      minWidth: 800,
      scrollPositionX: 0,
      opacity: 1
    };
    
    // Set initial view to show only first 5 categories
    chartOptions.xAxis.min = 0;
    chartOptions.xAxis.max = 4;
    
    // Add bottom margin for scrollbar
    chartOptions.chart.marginBottom = 80;
    
    // Add scrollbar to xAxis
    chartOptions.xAxis.scrollbar = {
      enabled: true,
      barBackgroundColor: '#c1c7d0',
      trackBackgroundColor: '#f5f5f5',
      buttonBackgroundColor: '#e6e6e6',
      buttonBorderColor: '#c1c7d0',
      rifleColor: '#666',
      height: 14,
      margin: 5
    };
  }

  this.responseFlag = true;
}


// Override Highcharts scrollbar styling specifically for this component
:host ::ng-deep .highcharts-scrollbar {
  .highcharts-scrollbar-track {
      fill: #f5f5f5;
      stroke: #e0e0e0;
      stroke-width: 1;
  }
  
  .highcharts-scrollbar-thumb {
      fill: #6c757d;
      stroke: #6c757d;
      rx: 3;
      ry: 3;
  }
  
  .highcharts-scrollbar-button {
      fill: #e6e6e6;
      stroke: #c1c7d0;
  }
  
  .highcharts-scrollbar-arrow {
      fill: #666;
  }
}

:host ::ng-deep .highcharts-scrollbar-group {
  visibility: visible !important;
}