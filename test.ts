getStackedColumnChart(ChartOptions: any) {
  const ChartValues: any = [];

  // --- build scroll config safely ---
  const scrollablePlotArea = ChartOptions.enableScroll
    ? { scrollablePlotArea: { minWidth: 1200, scrollPositionX: 0 } }
    : {};

  const xAxisScroll = ChartOptions.enableScroll
    ? {
        min: 0,
        max: (ChartOptions.visibleBars ?? 5) - 1,
        scrollbar: { enabled: true }
      }
    : {};

  ChartValues.push({
    Highcharts: Highcharts,
    chartConstructor: 'chart',
    chartOptions: {
      title: { text: '' },
      chart: {
        type: 'column',
        width: ChartOptions.chartWidth,
        height: ChartOptions.chartHeight,
        backgroundColor: '#ffffff',
        plotBackgroundColor: '#ffffff',
        plotBorderWidth: 1,
        ...scrollablePlotArea   // ✅ safe merge
      },
      xAxis: {
        categories: ChartOptions.xAxisCategory,
        title: { text: ChartOptions.xAxisTitle },
        ...xAxisScroll          // ✅ safe merge
      },
      yAxis: [{
        min: 0,
        title: {
          text: ChartOptions.yAxisTitle ? ChartOptions.yAxisTitle : 'Percentage'
        }
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
      legend: { enabled: ChartOptions.legendVisible },
      series: ChartOptions.dataseries,
      credits: { enabled: false }
    } as Highcharts.Options
  });

  return ChartValues;
}
