updateChart() {
  const start = this.currentPage * this.pageSize;
  const end = Math.min(start + this.pageSize, this.allCategories.length);

  const pageCategories = this.allCategories.slice(start, end);
  const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));

  const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
  const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

  // Make sure we have data before updating
  if (pageCategories.length === 0) {
    console.log("No categories to display");
    return;
  }

  console.log("Updating chart with categories:", pageCategories);
  console.log("Updating chart with series data:", pageSeriesData);

  this.chartOptions = {
    chart: { 
      type: 'column',
      height: 330
    },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: pageCategories,
      title: {
        text: '',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Staff Count',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        pointWidth: 22,
        borderWidth: 0,
        dataLabels: { 
          enabled: true,
          style: {
            fontSize: '11px',
            fontWeight: '500'
          }
        }
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '13px',
        fontWeight: '500'
      }
    },
    series: pageSeriesData.map((data, idx) => ({
      type: 'column',
      name: seriesNames[idx],
      color: colors[idx],
      showInLegend: true,
      data: data
    }))
  };

  // Force Highcharts to update
  this.Highcharts.chart = this.chartOptions as any;

  // Update pagination buttons
  this.isLeftDisabled = this.currentPage === 0;
  const maxPage = Math.ceil(this.allCategories.length / this.pageSize) - 1;
  this.isRightDisabled = this.currentPage >= maxPage;
  
  console.log("Chart options updated:", this.chartOptions);
}