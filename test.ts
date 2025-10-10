<highcharts-chart 
    [Highcharts]="Highcharts" 
    [options]="chartOptions"
    [update]="updateFlag"
    style="width: 99%; height: 330px; display: block;">
</highcharts-chart>

updateChart() {
  const start = this.currentPage * this.pageSize;
  const end = Math.min(start + this.pageSize, this.allCategories.length);

  const pageCategories = this.allCategories.slice(start, end);
  const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));

  const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
  const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

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
        borderWidth: 0,
        dataLabels: { 
          enabled: true,
          style: { 
            textOutline: 'none',
            fontWeight: '500' 
          }
        }
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    series: pageSeriesData.map((data, idx) => ({
      type: 'column',
      name: seriesNames[idx],
      color: colors[idx],
      data: data
    }))
  };

  // Force Highcharts to update
  this.updateFlag = true;

  // Update pagination buttons
  this.isLeftDisabled = this.currentPage === 0;
  const maxPage = Math.ceil(this.allCategories.length / this.pageSize) - 1;
  this.isRightDisabled = this.currentPage >= maxPage;

  console.log("Chart updated - Categories:", pageCategories);
  console.log("Chart updated - Series data:", pageSeriesData);
}