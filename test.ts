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
      allowOverlap: true,   // ← don’t hide/truncate due to overlap
      crop: false,          // ← don’t crop at plot edge
      distance: 24,         // ← a little farther out so it has room
      padding: 0,
      // If your Highcharts version supports it, this also helps:
      // overflow: 'none',
      formatter: function (this: any) {
        const p = Math.round(this.percentage || 0);
        return `${this.y}(${p}%)`;
      },
      style: {
        color: '#3c3c3c',
        fontSize: '13px',
        textOutline: 'none',
        textOverflow: 'none' // ← disable built-in ellipsis
      }
      // If your labels still get cut, use HTML labels:
      // useHTML: true
    }
  }
}
