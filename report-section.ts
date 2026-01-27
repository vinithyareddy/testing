getExpenseTypeCharts(width: number) {
  const fixedExpenseData = [
    { name: 'Staff Expenses', y: 88.4, color: '#66C4CA' },
    { name: 'Equipment & Building', y: 4.2, color: '#E15759' },
    { name: 'Depreciation', y: 3.6, color: '#59A14F' },
    { name: 'Communications', y: 5.6, color: '#4E79A7' }
  ];

  const variableExpenseData = [
    { name: 'ET Consultants', y: 43.2, color: '#66C4CA' },
    { name: 'ST Consultants', y: 4.2, color: '#E15759' },
    { name: 'Other Expenses', y: 3.6, color: '#59A14F' },
    { name: 'Service & Support Fees', y: 5.6, color: '#4E79A7' },
    { name: 'Representation', y: 21.4, color: '#2F5597' },
    { name: 'Contractual Services', y: 24.4, color: '#A392D3' }
  ];

  const pieOptions = (data: any[]) => ({
    chartWidth: width / 2 - 32,
    chartHeight: 280,
    dataseries: [{
      data,
      size: '65%',          // 🔑 shorter connectors
      innerSize: '0%',
      startAngle: -90,      // 🔑 rotate left
      showInLegend: false   // legend via HTML
    }],
    dataLabelEnable: true,
    legendVisible: false
  });

  this.chartList = [
    ...this.chartService.GetPieChart(pieOptions(fixedExpenseData)),
    ...this.chartService.GetPieChart(pieOptions(variableExpenseData))
  ];

  // legend data for HTML legend
  this.legendData = this.selectedFilter === 'Expense Type'
    ? [...fixedExpenseData, ...variableExpenseData]
    : [];
}
