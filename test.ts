onLoadLineChart() {
  this.responseFlag = true;

  // Same data as your visual
  const years = ['2022', '2023', '2024', '2025'];
  const buy = [30, 40, 50, 60];
  const build = [65, 67, 68, 66];
  const borrow = [40, 45, 50, 55];

  this.chartOptions = {
    chart: {
      type: 'line',
      height: 330,
      spacingTop: 20,
      spacingBottom: 10,
      marginTop: 20,
      marginBottom: 90
    },

    title: { text: undefined },
    credits: { enabled: false },

    xAxis: {
      categories: years,
      labels: {
        style: { fontSize: '11px', color: '#333' },
        y: 15
      },
      tickLength: 0,
      gridLineWidth: 0,
      lineWidth: 0
    },

    yAxis: {
      title: { text: 'Total Count' },
      min: 0,
      max: 80,
      tickInterval: 20,
      gridLineWidth: 0.5,
      lineWidth: 0,
      labels: { style: { color: '#333' } }
    },

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      reversed: false, // keep same order as data
      itemStyle: { fontWeight: '400', color: '#333' },
      itemMarginTop: 5
    },

    tooltip: {
      shared: true,
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
      }
    },

    series: [
      {
        name: 'Borrow',
        type: 'line',
        color: '#95dad9',
        data: borrow,
        marker: { lineColor: '#95dad9' },
        dashStyle: 'ShortDot'
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
