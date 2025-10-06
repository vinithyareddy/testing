onLoadColumnChart() {
  this.responseFlag = true;

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 350,
    },
    title: { text: undefined },
    xAxis: {
      categories: [
        'Planned<br>2022', 'Actuals<br>2022',
        'Planned<br>2023', 'Actuals<br>2023',
        'Planned<br>2024', 'Actuals<br>2024',
        'Planned<br>2025', 'Actuals<br>2025'
      ],
      labels: {
        useHTML: true,
        style: { fontSize: '12px', color: '#333', textAlign: 'center' }
      }
    },
    yAxis: [
      {
        title: { text: 'Total Count' },
        max: 30,
        labels: { style: { color: '#333' } }
      },
      {
        title: { text: 'Percentage' },
        opposite: true,
        max: 100,
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
        return `<b>${this.x.replace('<br>', ' ')}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y} (${p.percentage?.toFixed(0)}%)`
          ).join('<br/>');
      }
    },
    plotOptions: {
      column: {
        stacking: 'percent',
        borderWidth: 0,
        pointPadding: 0.05,
        groupPadding: 0.15,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.percentage ? `${this.percentage.toFixed(0)}%` : '';
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
        data: [3, 2.5, 2, 2, 2, 2, 2, 2],
        stack: 'PlannedActuals'
      },
      {
        name: 'Build',
        type: 'column',
        color: '#7B68EE',
        data: [9, 5, 6, 5, 5, 5, 4, 4],
        stack: 'PlannedActuals'
      },
      {
        name: 'Borrow',
        type: 'column',
        color: '#5CC4A2',
        data: [18, 17.5, 14, 14, 13, 13, 12, 12],
        stack: 'PlannedActuals'
      },
      // Add top value labels
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
