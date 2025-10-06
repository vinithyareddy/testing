onLoadColumnChart() {
  this.responseFlag = true;

  // Sample data
  const buy = [3, 2.5, 2, 2, 2, 2, 2, 2];
  const build = [9, 5, 6, 5, 5, 5, 4, 4];
  const borrow = [18, 17.5, 14, 14, 13, 13, 12, 12];
  const totals = buy.map((v, i) => v + build[i] + borrow[i]);

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 370,
      spacingTop: 30,   // adds top space so totals fit
      spacingBottom: 40
    },
    title: { text: undefined },

    xAxis: {
      categories: [
        { name: '2022', categories: ['Planned', 'Actuals'] },
        { name: '2023', categories: ['Planned', 'Actuals'] },
        { name: '2024', categories: ['Planned', 'Actuals'] },
        { name: '2025', categories: ['Planned', 'Actuals'] }
      ] as any,
      labels: {
        style: { fontSize: '12px', color: '#333' },
        y: 25 // moves years down
      },
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      lineColor: 'transparent',
      tickColor: 'transparent'
    } as any,

    yAxis: [
      {
        title: { text: 'Total Count' },
        min: 0,
        max: 30,
        tickInterval: 5,
        gridLineWidth: 0.5,
        lineWidth: 0,
        labels: { style: { color: '#333' } }
      },
      {
        title: { text: 'Percentage' },
        opposite: true,
        min: 0,
        max: 100,
        tickInterval: 25,
        gridLineWidth: 0,
        lineWidth: 0,
        labels: { format: '{value}%', style: { color: '#333' } }
      }
    ],

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' }
    },

    tooltip: {
      shared: true,
      formatter: function () {
        const title = String(this.x);
        return `<b>${title}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y} (${Math.round(p.percentage)}%)`
          ).join('<br/>');
      }
    },

    plotOptions: {
      column: {
        stacking: 'percent',
        borderWidth: 0,
        pointPadding: 0.05,
        groupPadding: 0.15,
        pointWidth: 18, // slightly thinner bars for full visibility
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.percentage ? `${Math.round(this.percentage)}%` : '';
          },
          style: { fontSize: '10px', textOutline: 'none', color: '#000' }
        }
      }
    },

    series: [
      {
        name: 'Buy',
        type: 'column',
        color: '#4A90E2',
        data: buy,
        stack: 'BBB'
      },
      {
        name: 'Build',
        type: 'column',
        color: '#7B68EE',
        data: build,
        stack: 'BBB'
      },
      {
        name: 'Borrow',
        type: 'column',
        color: '#5CC4A2',
        data: borrow,
        stack: 'BBB'
      },
      {
        name: 'Total Labels',
        type: 'scatter',
        showInLegend: false,
        enableMouseTracking: false,
        color: 'transparent',
        yAxis: 0,
        data: totals,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `<b>${totals[this.point.index]}</b>`;
          },
          y: -18, // adjust if needed
          style: { fontWeight: '700', color: '#000', fontSize: '11px' }
        }
      }
    ]
  };

  this.swfpColumnChart = [{
    Highcharts: this.Highcharts,
    chartConstructor: 'chart',
    chartOptions: this.chartOptions
  }];
}
