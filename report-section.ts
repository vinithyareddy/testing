chartWidth: width


const pieOptions = (title: string, data: any[]) => ({
  chartTitle: title,
  chartWidth: width,
  chartHight: 260,
  dataseries: [{
    name: title,
    data: data,
    showInLegend: true
  }],
  dataLabelEnable: true,
  legendVisible: true
});
