onLoadColumnChart() {
  this.responseFlag = true;

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 350,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: [
        'Planned 2022', 'Actuals 2022',
        'Planned 2023', 'Actuals 2023',
        'Planned 2024', 'Actuals 2024',
        'Planned 2025', 'Actuals 2025'
      ],
      crosshair: true,
      labels: { style: { fontSize: '12px', color: '#333' } }
    },
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
    tooltip: {
      shared: true,
      formatter: function () {
        return `<b>${this.x}</b><br/>
          ${this.points?.map((p: any) => `${p.series.name}: ${p.y} (${p.percentage.toFixed(0)}%)`).join('<br/>')}`;
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' }
    },
    plotOptions: {
      column: {
        stacking: 'percent',
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.percentage ? `${this.percentage.toFixed(0)}%` : '';
          },
          style: { fontSize: '11px', textOutline: 'none' }
        }
      }
    },
    series: [
      {
        name: 'Buy',
        type: 'column',
        color: '#4A90E2',
        data: [3, 2.5, 2, 2, 2, 2, 2, 2]
      },
      {
        name: 'Build',
        type: 'column',
        color: '#7B68EE',
        data: [9, 5, 6, 5, 5, 5, 4, 4]
      },
      {
        name: 'Borrow',
        type: 'column',
        color: '#5CC4A2',
        data: [18, 17.5, 14, 14, 13, 13, 12, 12]
      }
    ]
  };

  // Assign to chart array
  this.swfpColumnChart = [{
    Highcharts: this.Highcharts,
    chartConstructor: 'chart',
    chartOptions: this.chartOptions
  }];
}


::ng-deep .highcharts-legend-item text {
  font-size: 12px !important;
}

::ng-deep .highcharts-data-label text {
  font-weight: 600 !important;
}

::ng-deep .highcharts-axis-title {
  font-weight: 600 !important;
}
