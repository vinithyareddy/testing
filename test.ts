getStackedColumnChart(ChartOptions: any) {
  const outsidethis = this;
  const ChartValues: any = [];
  
  // Calculate the width needed to show only 5 categories
  const categoriesCount = ChartOptions.xAxisCategory.length;
  const visibleCategories = 5;
  const categoryWidth = 80; // Width per category (adjust as needed)
  const minPlotWidth = categoriesCount * categoryWidth;
  
  ChartValues.push({
      Highcharts: Highcharts,
      chartConstructor: 'chart',
      chartOptions: {
          title: {
              text: ''
          },
          chart: {
              type: 'column',
              width: ChartOptions.chartWidth,
              height: ChartOptions.chartHeight,
              backgroundColor: '#ffffff',
              plotBackgroundColor: '#ffffff',
              plotBorderWidth: 1,
              // Add scrollable plot area configuration
              scrollablePlotArea: {
                  minWidth: minPlotWidth,
                  scrollPositionX: 0,
                  opacity: 1
              }
          },
          xAxis: {
              categories: ChartOptions.xAxisCategory,
              title: {
                  text: ChartOptions.xAxisTitle
              },
              // Enable scrollbar for x-axis
              scrollbar: {
                  enabled: true,
                  barBackgroundColor: '#c1c7d0',
                  trackBackgroundColor: '#f5f5f5',
                  buttonBackgroundColor: '#e6e6e6',
                  buttonBorderColor: '#c1c7d0',
                  rifleColor: '#666',
                  height: 14
              },
              // Set min and max to show only 5 categories initially
              min: 0,
              max: visibleCategories - 1
          },
          yAxis: [{
              min: 0,
              title: {
                  text: ChartOptions.yAxisTitle ? ChartOptions.yAxisTitle : 'Percentage'
              },
              stackLabels: {},
          },
          {
              title: {
                  text: ChartOptions.title,
              },
              opposite: true
          }],
          tooltip: {
              pointFormat: '{series.name}: <b>{point.y:,.1f}</b>',
              outside: true
          },
          plotOptions: {
              column: {
                  stacking: 'normal',
                  pointWidth: 25
              }
          },
          legend: {
              enabled: ChartOptions.legendVisible,
          },
          series: ChartOptions.dataseries,
          credits: {
              enabled: false
          },
      } as Highcharts.Options
  });
  return ChartValues;
}