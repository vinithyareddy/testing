renderChart() {

  this.AssigmntDataChart = [];

  if (!this.chartContainer) return;

  const width = this.chartContainer.nativeElement.offsetWidth || 800;
  const chartHeight = 350;

  const indices = this.filteredCategories.map(cat =>
    this.orgCategories.indexOf(cat)
  );

  let chartSeries: any[] = [];

  if (this.selectedView === 'ORG') {
    chartSeries = this.orgChartData;
  }

  if (this.selectedView === 'GENDER') {
    chartSeries = this.genderChartData;
  }

  if (this.selectedView === 'APPT_TYPE') {
    chartSeries = this.apptTypeChartData;
  }

  if (this.selectedView === 'HQCO') {
    chartSeries = this.hqcoChartData;
  }

  const ChartOptions = {
    chartTitle: 'Salaried Workforce by Duty Country (Current Year)',
    chartWidth: width,
    chartHeight: chartHeight,
    xAxisCategory: this.filteredCategories,
    legendVisible: true,

    dataseries: chartSeries.map(s => ({
      name: s.name,
      data: indices.map(i => s.data[i]),
      color: s.color,
      borderRadius: 3,
      pointWidth: 20
    })),

    pointPadding: 0.15,
    groupPadding: 0.1,

    xAxisVisible: true,
    yAxisVisible: true,

    xAxisTitle: '',
    yAxisTitle: 'Salaried Workforce',

    dataLabelEnable: true,
    datalabelFormat: '#',

    isStacked: false
  };

  this.AssigmntDataChart =
    this.highChartsService.GetColumnChart(ChartOptions);

}

// Gender View
genderChartData = [
  { name: 'Male', data: [80, 50, 64, 50, 34, 50, 64], color: '#5C6BC0' },
  { name: 'Female', data: [42, 28, 17, 28, 24, 28, 17], color: '#80CBC4' }
];

// Appt Type View
apptTypeChartData = [
  { name: 'OPEN', data: [77, 77, 77, 77, 77, 77], color: '#3949AB' },
  { name: 'TERM', data: [48, 48, 48, 48, 48, 48], color: '#66BB6A' },
  { name: 'STC/STT', data: [15, 15, 15, 15, 15, 15], color: '#B39DDB' },
  { name: 'EFTEC/ETT', data: [62, 62, 62, 62, 62, 62], color: '#4FC3F7' },
  { name: 'SPAS', data: [42, 42, 42, 42, 42, 42], color: '#FFB74D' },
  { name: 'ED', data: [13, 13, 13, 13, 13, 13], color: '#E57373' }
];

// HQ / CO Appt View
hqcoChartData = [
  { name: 'HQ Appt', data: [80, 50, 64, 50, 34, 50, 64], color: '#5C6BC0' },
  { name: 'CO Appt', data: [42, 28, 17, 28, 24, 28, 17], color: '#66BB6A' }
];