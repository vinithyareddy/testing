plotOptions: {
  column: {
    stacking: 'percent',
    borderWidth: 0,
    pointPadding: 0.1,
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
