onLoadLineChart() {
  this.responseFlag = true;

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

    // ✅ X-axis (same style as before, just years)
    xAxis: {
      categories: years,
      labels: {
        style: { fontSize: '11px', color: '#333' },
        y: 15
      },
      tickLength: 0,
      gridLineWidth: 0.5,
      lineWidth: 0
    },

    // ✅ Single Y-axis
    yAxis: {
      title: { text: 'Total Count' },
      min: 0,
      max: 80,
      tickInterval: 20,
      gridLineWidth: 0.5,
      lineWidth: 0,
      labels: { style: { color: '#333' } }
    },

    // ✅ Legend with solid dots
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      reversed: true,
      symbolRadius: 6,
      symbolHeight: 10,
      symbolWidth: 10,
      symbolPadding: 5,
      itemStyle: { fontWeight: '400', color: '#333' },
      itemMarginTop: 5,
      itemMarginBottom: 0
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
          fillColor: '#fff',      // hollow inside
          lineWidth: 2            // colored border
        }
      },
      series: {
        dataLabels: { enabled: false }
      }
    },

    // ✅ Lines with hollow markers but solid legend dots
    series: [
      {
        name: 'Borrow',
        type: 'line',
        data: borrow,
        color: '#95dad9',
        marker: {
          fillColor: '#fff',
          lineColor: '#95dad9',
          lineWidth: 2,
          radius: 5
        },
        legendSymbol: 'circle'
      },
      {
        name: 'Build',
        type: 'line',
        data: build,
        color: '#a392d3',
        marker: {
          fillColor: '#fff',
          lineColor: '#a392d3',
          lineWidth: 2,
          radius: 5
        },
        legendSymbol: 'circle'
      },
      {
        name: 'Buy',
        type: 'line',
        data: buy,
        color: '#85caf7',
        marker: {
          fillColor: '#fff',
          lineColor: '#85caf7',
          lineWidth: 2,
          radius: 5
        },
        legendSymbol: 'circle'
      }
    ]
  };
}
