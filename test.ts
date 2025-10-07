plotOptions: {
  line: {
    lineWidth: 2,
    marker: {
      enabled: true,
      radius: 5,
      symbol: 'circle',
      fillColor: '#fff',   // ✅ white fill for chart dots
      lineWidth: 2         // colored border same as series color
    }
  },
  series: {
    dataLabels: { enabled: false },
    marker: {
      fillColor: '#fff',   // ✅ same for points on chart
      lineWidth: 2
    }
  }
},



legend: {
  layout: 'horizontal',
  align: 'center',
  verticalAlign: 'bottom',
  reversed: false,
  itemStyle: { fontWeight: '400', color: '#333' },
  itemMarginTop: 5,
  symbolRadius: 5,
  symbolHeight: 8,
  symbolWidth: 8,
  symbolPadding: 5
},


::ng-deep .highcharts-legend .highcharts-point {
  stroke-width: 0 !important;
  fill: currentColor !important; /* ✅ legend uses full color */
}
