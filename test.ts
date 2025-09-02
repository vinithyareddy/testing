loadWidget(type: string) {
  this.widgetType = type;
  if (this.fcvData.length > 0) {
    this.onInitLoad(this.fcvData);
  }
}

onInitLoad(data: any[]): void {
  this.ResponseFlag = true;
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  this.chartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true,
      y: -10,
      text: `<span style="font-size:30px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By FCV Status</span>`,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
    },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '85%',
        borderRadius: 0,
        showInLegend: true,
        dataLabels: {
          enabled: true,
          distance: 20,
          format: '{point.y} ({point.percentage:.0f}%)',
        },
        ...(this.widgetType === 'ch'
          ? { startAngle: -90, endAngle: 90, center: ['50%', '75%'], size: '140%' } // semi donut (big & pushed down)
          : { startAngle: 0, endAngle: 360, center: ['50%', '50%'], size: '100%' }), // full donut (centered circle)
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
