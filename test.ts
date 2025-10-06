{
  name: 'Total Labels',
  type: 'scatter',
  showInLegend: false,
  enableMouseTracking: false,
  color: 'transparent',
  yAxis: 0,
  data: totals,
  dataLabels: {
    enabled: true,
    formatter: function () {
      return `<b>${totals[this.point.index]}</b>`;
    },
    y: -1, // ✅ slightly reduced from -2 → touches every bar top evenly
    verticalAlign: 'bottom', // ✅ ensures consistent anchoring
    crop: false, // ✅ prevents clipping on tall bars
    overflow: 'none', // ✅ keeps visibility inside chart area
    style: { fontWeight: '700', color: '#000', fontSize: '11px' }
  }
}
