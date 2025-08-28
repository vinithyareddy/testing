ngOnInit(): void {
  this.locationData = [
    { name: 'US', value: 101, color: '#a392d3' },
    { name: 'Non-US', value: 112, color: '#523b92' }
  ];
}

onInitLoad(data: any[]): void {
  this.ResponseFlag = true;

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  this.chartOptions = {
    chart: { type: 'pie' },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true,
      y: -10,
      text: `<span style="font-size:30px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By Location</span>`,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
    },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '85%',
        size: '140%',
        borderRadius: 10, // ✅ curved ends (or set 0 for flat)
        showInLegend: true,
        dataLabels: {
          enabled: true,
          distance: 20,
          format: '{point.y} ({point.percentage:.0f}%)',
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Location',
        data: data.map(d => ({
          name: d.name,
          y: d.value,
          color: d.color,
        })),
      },
    ],
  };
}
