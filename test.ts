this.fcvData = [
  { name: 'FCV', value: 104, color: '#00796B' },
  { name: 'Non-FCV', value: 44, color: '#4DB6AC' },
];

onInitLoad(data: any[]): void {
  this.ResponseFlag = true;

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  this.chartOptions = {
    chart: {
      type: 'pie',
      height: 260,
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true,
      y: 40,
      text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/>
             <span style="font-size:12px">By FCV Status</span>`,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
    },
    credits: { enabled: false },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      symbolRadius: 6,
      itemStyle: { fontSize: '12px' },
    },
    plotOptions: {
      pie: {
        innerSize: '70%',
        borderRadius: 10,
        showInLegend: true,
        dataLabels: {
          enabled: true,
          distance: 15, // push labels outside arc
          format: '{y} ({point.percentage:.0f}%)',
          style: { fontSize: '12px' },
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
      },
    },
    series: [
      {
        type: 'pie',
        name: 'FCV Status',
        data: data.map((d) => ({
          name: d.name,
          y: d.value,
          color: d.color,
        })),
      },
    ],
  };
}
