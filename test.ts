onLoadColumnChart() {
  this.responseFlag = true;

  // ✅ Sample data (Planned + Actuals for each year)
  // Format: [Planned 2022, Actual 2022, Planned 2023, Actual 2023, Planned 2024, Actual 2024, Planned 2025, Actual 2025]
  const buy =    [3, 2.5, 2, 2, 2, 2, 2, 2];
  const build =  [9, 5,   6, 5, 5, 5, 4, 4];
  const borrow = [18,17.5,14,14,13,13,12,12];
  const totals  = buy.map((v, i) => v + build[i] + borrow[i]);

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 350,
      spacingBottom: 20
    },
    title: { text: undefined },

    // ✅ Grouped X-axis (Years + Planned/Actuals)
    xAxis: {
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      groupLineWidth: 0,
      gridLineColor: 'transparent',
      lineColor: 'transparent',
      tickColor: 'transparent',
      minorGridLineColor: 'transparent',
      categories: [
        { name: '2022', categories: ['Planned', 'Actuals'] },
        { name: '2023', categories: ['Planned', 'Actuals'] },
        { name: '2024', categories: ['Planned', 'Actuals'] },
        { name: '2025', categories: ['Planned', 'Actuals'] }
      ] as any,
      labels: {
        style: { fontSize: '12px', color: '#333' }
      }
    } as any,

    // ✅ Dual Y-axis
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
        tickInterval: 30,
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

    // ✅ Proper stacking and visuals
    plotOptions: {
      column: {
        stacking: 'percent',
        borderWidth: 0,
        pointPadding: 0.05,
        groupPadding: 0.15,
        pointWidth: 20, // slightly wider like example
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.percentage ? `${Math.round(this.percentage)}%` : '';
          },
          style: { fontSize: '10px', textOutline: 'none', color: '#000' }
        }
      }
    },

    // ✅ 3 stacked colors + total labels
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
          y: -25,
          style: { fontWeight: '700', color: '#000', fontSize: '11px' }
        }
      }
    ]
  };

  // ✅ Adjust year label position (optional)
  (this.chartOptions.xAxis as any).groupedCategories = {
    style: { fontSize: '13px', fontWeight: '600', color: '#333' },
    y: 25
  };

  this.swfpColumnChart = [{
    Highcharts: this.Highcharts,
    chartConstructor: 'chart',
    chartOptions: this.chartOptions
  }];
}
