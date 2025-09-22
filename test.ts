chart: {
  type: 'column',
  width: ChartOptions.chartWidth,
  height: ChartOptions.chartHeight,
  backgroundColor: '#ffffff',
  plotBackgroundColor: '#ffffff',
  plotBorderWidth: 1
},

xAxis: {
  categories: ChartOptions.xAxisCategory,
  title: { text: ChartOptions.xAxisTitle },

  // 👇 Only show 5 bars at once and enable scroll
  ...(ChartOptions.enableScroll ? {
    min: 0,
    max: (ChartOptions.visibleBars ?? 5) - 1,
    scrollbar: { enabled: true }
  } : {})
},
