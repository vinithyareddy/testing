<div class="chart-scroll-wrapper">
  <div class="chart-inner">
    <highcharts-chart
      [Highcharts]="columnChart.Highcharts"
      [options]="columnChart.chartOptions"
      [constructorType]="columnChart.chartConstructor">
    </highcharts-chart>
  </div>
</div>


.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;   // horizontal scroll
  overflow-y: hidden;
}

.chart-inner {
  min-width: calc(5 * 120px);   // 5 bars * ~120px each (adjust as needed)
}

.chart-inner .highcharts-container {
  width: 100% !important;   // let it expand
  height: 100% !important;
}


onLoadColumnChart() {
  const categories = ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH'];

  const ChartData = [
    { name: 'Managerial', data: [10,20,40,50,60,70,30,80], color: '#71cecd' },
    { name: 'Technical', data: [20,10,50,40,70,60,50,90], color: '#6b70af' }
  ];

  const barWidth = 120; // px per bar
  const visibleBars = 5;
  const totalWidth = categories.length * barWidth;

  const ChartOptions = {
    chart: {
      type: 'column',
      width: totalWidth,   // 👈 force chart to be wide
      height: 330,
      backgroundColor: '#fff'
    },
    xAxis: {
      categories,
      title: { text: 'Grade' }
    },
    yAxis: {
      title: { text: 'Percentage' }
    },
    series: ChartData,
    legend: { enabled: false },
    plotOptions: {
      column: { dataLabels: { enabled: true } }
    }
  };

  this.swfpColumnChart = [{
    Highcharts: this.service.Highcharts,
    chartConstructor: 'chart',
    chartOptions: ChartOptions
  }];
  this.responseFlag = true;
}
