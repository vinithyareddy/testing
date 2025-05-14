missingHours: number = 0;
adjustedHours: number = 0;
missingPercentage: number = 0;


this.missingHours = this.closedMonth + this.closingMonth + this.openedMonth;
this.adjustedHours = Math.round(this.missingHours / (this.closedHrPer + this.closingHrPer + this.openHrPer) * 100);
this.missingPercentage = Math.round((this.missingHours / this.adjustedHours) * 100);


import * as Highcharts from 'highcharts';

ngAfterViewInit() {
  this.renderCompliancePieChart();
}

renderCompliancePieChart() {
  Highcharts.chart('compliancePieContainer', {
    chart: {
      type: 'pie',
      height: 180
    },
    title: {
      text: `${this.missingPercentage}%`,
      verticalAlign: 'middle',
      floating: true,
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: '<b>{point.y} hours</b>'
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
      name: 'Hours',
      data: [
        { name: 'Missing Time', y: this.missingHours, color: '#0056D2' },
        { name: 'Adjusted Required', y: this.adjustedHours - this.missingHours, color: '#c4c4c4' }
      ]
    }]
  });
}
