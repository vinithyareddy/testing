onLoadLineChart() {
  this.responseFlag = true;

  // Simplified yearly totals
  const years = ['2022', '2023', '2024', '2025'];
  const buy = [3, 2.5, 2, 3];
  const build = [9, 5, 6, 5];
  const borrow = [18, 17.5, 14, 10];

  this.chartOptions = {
    chart: {
      type: 'line',
      height: 330,
      spacingTop: 20,
      spacingBottom: 10,
      marginTop: 20,
      marginBottom: 90,
      animation: true
    },

    title: { text: undefined },
    credits: { enabled: false },

    xAxis: {
      categories: years,
      tickLength: 0,
      lineWidth: 0,
      gridLineWidth: 0,
      labels: {
        style: { fontSize: '12px', color: '#333' },
        y: 15
      }
    },

    yAxis: {
      title: { text: 'Total Count' },
      min: 0,
      max: 30,
      tickInterval: 5,
      gridLineWidth: 0.5,
      lineWidth: 0,
      labels: { style: { color: '#333' } }
    },

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' },
      itemMarginTop: 5,
      itemMarginBottom: 0
    },

    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        return `<b>${this.x}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y}`
          ).join('<br/>');
      }
    },

    plotOptions: {
      line: {
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 5,
          symbol: 'circle',
          fillColor: '#fff',
          lineWidth: 2
        }
      },
      series: {
        animation: true,
        dataLabels: { enabled: false },
        enableMouseTracking: true
      }
    },

    series: [
      {
        name: 'Borrow',
        type: 'line',
        color: '#95dad9',
        data: borrow,
        marker: { lineColor: '#95dad9' }
      },
      {
        name: 'Build',
        type: 'line',
        color: '#a392d3',
        data: build,
        marker: { lineColor: '#a392d3' }
      },
      {
        name: 'Buy',
        type: 'line',
        color: '#85caf7',
        data: buy,
        marker: { lineColor: '#85caf7' }
      }
    ]
  };
}
