chart: {
  type: 'column',
  width: ChartOptions.chartWidth,
  height: ChartOptions.chartHeight,
  backgroundColor: '#ffffff',
  plotBackgroundColor: '#ffffff',
  plotBorderWidth: 1,

  // 👇 Add scrollable plot area
  scrollablePlotArea: {
      minWidth: 800,       // width needed for all categories
      scrollPositionX: 0   // start position
  }
},


xAxis: {
  categories: ChartOptions.xAxisCategory,
  title: { text: ChartOptions.xAxisTitle },
  min: 0,          // start index of visible categories
  max: 4,          // show 5 at a time (0–4 = GA–GE)
  scrollbar: {
      enabled: true
  }
},


chart: {
  type: 'column',
  width: ChartOptions.chartWidth,
  height: ChartOptions.chartHeight,
  backgroundColor: '#ffffff',
  plotBackgroundColor: '#ffffff',
  plotBorderWidth: 1,
  scrollablePlotArea: {
      minWidth: 1200,   // make wide enough for all bars
      scrollPositionX: 0
  }
},
xAxis: {
  categories: ChartOptions.xAxisCategory,
  title: { text: ChartOptions.xAxisTitle },
  min: 0,
  max: 4,  // show only first 5 categories at once
  scrollbar: { enabled: true }
},
