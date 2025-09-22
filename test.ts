// Replace your onLoadColumnChart() method with this:

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
    
    // Remove scrollablePlotArea approach and use xAxis range + scrollbar
    delete chartOptions.chart.scrollablePlotArea;
    
    // Set initial view to show only first 5 categories (0-4)
    chartOptions.xAxis.min = 0;
    chartOptions.xAxis.max = 4;
    chartOptions.xAxis.range = 5; // Show 5 categories at a time
    
    // Add scrollbar configuration
    chartOptions.xAxis.scrollbar = {
      enabled: true,
      showFull: false,
      height: 20,
      barBackgroundColor: 'rgba(128, 128, 128, 0.3)',
      trackBackgroundColor: 'rgba(128, 128, 128, 0.1)',
      buttonBackgroundColor: 'rgba(128, 128, 128, 0.4)',
      buttonBorderColor: 'rgba(128, 128, 128, 0.4)',
      rifleColor: 'rgba(128, 128, 128, 0.8)',
      buttonBorderRadius: 2,
      trackBorderRadius: 2,
      barBorderRadius: 2
    };
    
    // Ensure chart has enough bottom margin for scrollbar
    chartOptions.chart.marginBottom = 100;
    chartOptions.chart.spacingBottom = 20;
    
    // Add events to handle scrolling
    chartOptions.chart.events = {
      load: function() {
        // This ensures the scrollbar is properly initialized
        if (this.xAxis && this.xAxis[0]) {
          this.xAxis[0].update({
            min: 0,
            max: 4
          }, false);
          this.redraw();
        }
      }
    };
  }

  this.responseFlag = true;
}

// Alternative approach - if the above doesn't work, try this version:
onLoadColumnChartAlternative() {
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

  // Create chart with specific scrollbar settings
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

  // Get chart from service
  this.swfpColumnChart = this.service.getStackedColumnChart(ChartOptions);
  
  // Completely override the xAxis configuration
  if (this.swfpColumnChart && this.swfpColumnChart.length > 0) {
    const chartOptions = this.swfpColumnChart[0].chartOptions;
    
    // Override xAxis completely
    chartOptions.xAxis = {
      categories: xAxisCategory,
      title: {
        text: 'Grade'
      },
      min: 0,
      max: 4,
      scrollbar: {
        enabled: true,
        height: 20,
        barBackgroundColor: '#c1c7d0',
        trackBackgroundColor: '#f5f5f5',
        buttonBackgroundColor: '#e6e6e6',
        buttonBorderColor: '#c1c7d0',
        rifleColor: '#666'
      },
      // Force the range
      minRange: 5,
      maxZoom: 5
    };
    
    chartOptions.chart.marginBottom = 80;
  }

  this.responseFlag = true;
}