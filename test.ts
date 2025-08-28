plotOptions: {
  pie: {
    startAngle: -90,
    endAngle: 90,
    center: ['50%', '85%'],
    size: '140%',
    innerSize: '70%',
    borderWidth: 0,
    allowPointSelect: false,
    dataLabels: {
      enabled: true,
      // FIX: use PointLabelObject type instead of DataLabelsFormatterContextObject
      formatter: function (this: Highcharts.PointLabelObject) {
        const p = Math.round(this.percentage || 0);
        return `${this.y}(${p}%)`;
      },
      distance: 18,
      style: {
        color: '#3c3c3c',
        fontSize: '13px',
        textOutline: 'none',
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
      }
    }
  }
}
