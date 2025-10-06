onLoadColumnChart() {
  this.responseFlag = true;

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 350
    },
    title: { text: undefined },

    // ✅ 1. X-Axis: 2 bars per year (Planned + Actuals)
    xAxis: {
      categories: [
        'Planned', 'Actuals',    // 2022
        'Planned', 'Actuals',    // 2023
        'Planned', 'Actuals',    // 2024
        'Planned', 'Actuals'     // 2025
      ],
      labels: {
        formatter: function () {
          // Add year label below each pair
          const years = ['2022', '2023', '2024', '2025'];
          const index = Math.floor(this.pos / 2);
          return this.value + '<br><span style="font-size:11px;color:#777">' + years[index] + '</span>';
        },
        useHTML: true,
        style: { fontSize: '12px', color: '#333', textAlign: 'center' }
      }
    },

    // ✅ 2. Y-Axis dual
    yAxis: [{
      title: { text: 'Total Count' },
      max: 30,
      labels: { style: { color: '#333' } }
    }, {
      title: { text: 'Percentage' },
      opposite: true,
      max: 100,
      labels: { format: '{value}%', style: { color: '#333' } }
    }],

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' }
    },

    tooltip: {
      shared: true,
      formatter: function () {
        const xLabel = String(this.x);
        return `<b>${xLabel}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y} (${p.percentage?.toFixed(0)}%)`
          ).join('<br/>');
      }
    },

    // ✅ 3. Styling: thin bars, visible color stacks
    plotOptions: {
      column: {
        stacking: 'percent',
        borderWidth: 0,
        pointPadding: 0.15,
        groupPadding: 0.05,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.percentage ? `${this.percentage.toFixed(0)}%` : '';
          },
          style: { fontSize: '10px', textOutline: 'none', color: '#000' }
        }
      }
    },

    // ✅ 4. Realistic sample data matching your reference chart
    series: [
      {
        name: 'Buy',
        type: 'column',
        color: '#4A90E2',
        yAxis: 1,
        data: [3, 2, 2, 2, 2, 2, 2, 2],
        stack: 'BBB'
      },
      {
        name: 'Build',
        type: 'column',
        color: '#7B68EE',
        yAxis: 1,
        data: [9, 5, 6, 5, 5, 5, 4, 4],
        stack: 'BBB'
      },
      {
        name: 'Borrow',
        type: 'column',
        color: '#5CC4A2',
        yAxis: 1,
        data: [18, 17.5, 14, 14, 13, 13, 12, 12],
        stack: 'BBB'
      },

      // ✅ 5. Top total labels
      {
        name: 'Total Labels',
        type: 'scatter',
        yAxis: 0,
        enableMouseTracking: false,
        color: 'transparent',
        dataLabels: {
          enabled: true,
          formatter: function () {
            const totalValues = [30, 25, 22, 22, 21, 21, 20, 20];
            return `<b>${totalValues[this.point.index]}</b>`;
          },
          y: -25,
          style: { fontWeight: '700', color: '#000', fontSize: '11px' }
        },
        data: [30, 25, 22, 22, 21, 21, 20, 20]
      }
    ]
  };

  this.swfpColumnChart = [{
    Highcharts: this.Highcharts,
    chartConstructor: 'chart',
    chartOptions: this.chartOptions
  }];
}
