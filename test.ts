renderComplianceRateChart(): void {
    Highcharts.chart('compliancePieContainer', {
      chart: {
        type: 'pie',
        height: 180
      },
      title: {
        text: `${this.complianceRatePercentage}%`,
        verticalAlign: 'middle',
        floating: true,
        style: {
          fontSize: '20px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        pointFormat: '<b>{point.name}: {point.y} hours</b>'
      },
      plotOptions: {
        pie: {
          innerSize: '60%',
          dataLabels: {
            enabled: false
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Compliance',
        data: [
          { name: 'Missing Time', y: this.complianceMissingTime, color: '#0056D2' },
          { name: 'Adjusted Required', y: this.complianceAdjustedRequired - this.complianceMissingTime, color: '#c4c4c4' }
        ]
      }]
    });
  }
  