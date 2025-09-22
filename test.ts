chart: {
  type: 'column',
  height: ChartOptions.chartHeight,
  backgroundColor: '#ffffff',
  plotBackgroundColor: '#ffffff',
  plotBorderWidth: 1,

  scrollablePlotArea: {
    minWidth: 1600,   // must be wider than container
    scrollPositionX: 0
  }
},

xAxis: {
  categories: ChartOptions.xAxisCategory,
  title: { text: ChartOptions.xAxisTitle }
},
