Highcharts = Highcharts; // <-- If not already declared at top
complianceChartOptions: any;
complianceRate = 0;


// Calculate complianceRate for Open + Closing Months
let totalMissingHours = 0;
let totalAdjustedRequired = 0;

this.details.forEach(x => {
  const flag = x['RM Data[TRS Month Flag]'];
  if (flag === 'Open Months' || flag === 'Closing Months') {
    const missing = x['[Missing Time, Hours]'] !== null ? +x['[Missing Time, Hours]'] : 0;
    const adjusted = x['[Adjusted Required, Hours]'] !== null ? +x['[Adjusted Required, Hours]'] : 0;
    totalMissingHours += missing;
    totalAdjustedRequired += adjusted;
  }
});

this.complianceRate = totalAdjustedRequired !== 0 ? Math.round((totalMissingHours / totalAdjustedRequired) * 100) : 0;
this.initComplianceChart(); // Initialize chart after computing %


initComplianceChart() {
    const grey = '#d3d3d3';
    const blue = '#00aaff'; // match your current theme
    const missing = this.complianceRate;
    const entered = 100 - missing;
  
    this.complianceChartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: null,
        height: 120,
        width: 120
      },
      title: { text: '' },
      tooltip: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '70%',
          borderWidth: 0,
          dataLabels: { enabled: false }
        }
      },
      series: [{
        type: 'pie',
        data: [
          { y: missing, color: blue },
          { y: entered, color: grey }
        ]
      }]
    };
  }
  