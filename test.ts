onLoadColumnChart() {
  let xAxisCategory = ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH'];

  const ChartData = [
    {
      name: 'Managerial',
      data: [10, 20, 40, 50, 60, 70, 30, 80],
      color: '#71cecd',
    },
    {
      name: 'Technical',
      data: [20, 10, 50, 40, 70, 60, 50, 90],
      color: '#6b70af',
    }
  ];

  const ChartOptions = {
    chart: {
      type: 'column',
      height: 330,
      backgroundColor: '#ffffff',
      plotBorderWidth: 1,
      // 👇 Enable scrollable plot area
      scrollablePlotArea: {
        minWidth: 1000,   // larger than visible width
        scrollPositionX: 0
      }
    },
    title: { text: 'Work Force Supply' },
    xAxis: {
      categories: xAxisCategory,
      title: { text: 'Grade' },
      min: 0,  // start with first category
      max: 4,  // show only 5 bars initially
      scrollbar: { enabled: true }
    },
    yAxis: {
      title: { text: 'Percentage' }
    },
    series: ChartData,
    legend: { enabled: false },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true
        }
      }
    }
  };

  // 👇 this only applies for THIS widget
  this.swfpColumnChart = [{
    Highcharts: this.service.Highcharts,
    chartConstructor: 'chart',
    chartOptions: ChartOptions
  }];

  this.responseFlag = true;
}
