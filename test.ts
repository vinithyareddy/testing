onLoadLineChart() {
  this.responseFlag = true;

  // Data for each metric by year
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
      marginBottom: 60
    },

    title: { text: undefined },
    credits: { enabled: false },

    xAxis: {
      categories: years,
      lineWidth: 1,
      tickLength: 0,
      labels: {
        style: { fontSize: '12px', color: '#333', fontWeight: '400' },
        y: 10
      }
    },

    yAxis: {
      title: { text: 'Total Count' },
      gridLineWidth: 0.5,
      min: 0,
      max: 80,
      tickInterval: 20,
      labels: { style: { fontSize: '12px', color: '#333' } }
    },

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' },
      symbolRadius: 6
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
      },
      series: {
        dataLabels: {
          enabled: false
        }
      }
    },

    series: [
      {
        name: 'Buy',
        type: 'line',
        data: buy,
        color: '#59A9E6',
        marker: { lineColor: '#59A9E6' }
      },
      {
        name: 'Build',
        type: 'line',
        data: build,
        color: '#7D66C4',
        marker: { lineColor: '#7D66C4' }
      },
      {
        name: 'Borrow',
        type: 'line',
        data: borrow,
        color: '#64C3B5',
        dashStyle: 'ShortDot',
        marker: { lineColor: '#64C3B5' }
      }
    ]
  };
}
