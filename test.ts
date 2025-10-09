this.chartOptions = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories,
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Staff Count',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: { fontWeight: '500', fontSize: '13px' }
    },
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '{series.name}: {point.y} FTE<br/>'
    },
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: { fontSize: '11px', color: '#111827', textOutline: 'none' }
        }
      }
    },
    series: series as Highcharts.SeriesColumnOptions[]
  };
  