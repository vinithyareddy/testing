this.swfpColumnChart = this.service.getStackedColumnChart(ChartOptions);

// Modify chart options specifically for this component
if (this.swfpColumnChart && this.swfpColumnChart.length > 0) {
  const chartOptions = this.swfpColumnChart[0].chartOptions;
  
  // Override chart dimensions to prevent height from shrinking
  chartOptions.chart.spacingTop = 20;
  chartOptions.chart.spacingBottom = 60;
  chartOptions.chart.marginTop = 20;
  chartOptions.chart.marginBottom = 60;
  
  // Ensure height stays fixed
  chartOptions.chart.height = 330;