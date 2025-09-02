onInitLoad(data: any[]): void {
  this.ResponseFlag = true;
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  // Dynamically adjust chart size based on slice count
  let sliceCount = data.length;
  let fullDonutSize = '85%';
  let dataLabelDistance = 15;

  if (sliceCount > 6) {
    fullDonutSize = '70%';
    dataLabelDistance = 8;
  } else if (sliceCount > 3) {
    fullDonutSize = '78%';
    dataLabelDistance = 10;
  }

  this.chartOptions = {
    chart: { type: 'pie' },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true,
      y: -10,
      text: `<span style="font-size:30px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By Location</span>`,
    },
    tooltip: { pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)' },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '85%',
        borderRadius: 0,
        showInLegend: true,
        dataLabels: {
          enabled: true,
          distance: this.widgetType === 'ch' ? 20 : dataLabelDistance,
          format: '{point.y} ({point.percentage:.0f}%)',
          crop: false,
          overflow: 'justify',
        },
        ...(this.widgetType === 'ch'
          ? { startAngle: -90, endAngle: 90, center: ['50%', '75%'], size: '140%' } // semi donut
          : { startAngle: 0, endAngle: 360, center: ['50%', '50%'], size: fullDonutSize }), // auto-sized full donut
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Location',
        data: data.map(d => ({
          name: d.name,
          y: d.value,
          color: d.color
        })),
      },
    ],
  };
}
