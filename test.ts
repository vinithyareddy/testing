xAxis: {
  // Flattened categories so Highcharts can control spacing
  categories: [
    'Planned 2022', 'Actuals 2022',
    'Planned 2023', 'Actuals 2023',
    'Planned 2024', 'Actuals 2024',
    'Planned 2025', 'Actuals 2025'
  ],

  // Custom label formatter → shows year only once per pair
  labels: {
    useHTML: true,
    formatter: function () {
      const [label, year] = this.value.split(' ');
      const isPlanned = label === 'Planned';
      return `
        <div style="text-align:center;line-height:14px;">
          <span>${label}</span><br/>
          ${isPlanned ? `<span style="font-size:11px;color:#666;">${year}</span>` : ''}
        </div>
      `;
    },
    y: 25,
    style: { fontSize: '12px', color: '#333' }
  },

  lineWidth: 0,
  tickLength: 0,
  gridLineWidth: 0,
  lineColor: 'transparent',
  tickColor: 'transparent'
},

plotOptions: {
  column: {
    stacking: 'normal',
    borderWidth: 0,
    // ↓ Tighter spacing between Planned & Actuals
    pointPadding: 0,
    // ↓ Slight gap between different years
    groupPadding: 0.08,
    pointWidth: 25,
    dataLabels: {
      enabled: true,
      formatter: function () {
        const color = this.series.name === 'Build' ? '#fff' : '#000';
        return this.percentage
          ? `<span style="color:${color}">${Math.round(this.percentage)}%</span>`
          : '';
      },
      style: { fontSize: '10px', textOutline: 'none' }
    }
  }
},
