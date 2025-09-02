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
