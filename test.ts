// 1. First, update your service method to use xAxis scrollbar:

getStackedColumnChart(ChartOptions: any) {
  const outsidethis = this;
  const ChartValues: any = [];
  
  ChartValues.push({
      Highcharts: Highcharts,
      chartConstructor: 'chart',
      chartOptions: {
          title: {
              text: ''
          },
          chart: {
              type: 'column',
              width: ChartOptions.chartWidth,
              height: ChartOptions.chartHeight,
              backgroundColor: '#ffffff',
              plotBackgroundColor: '#ffffff',
              plotBorderWidth: 1,
              marginBottom: 80  // Extra space for scrollbar
          },
          xAxis: {
              categories: ChartOptions.xAxisCategory,
              title: {
                  text: ChartOptions.xAxisTitle
              },
              // Show only first 5 categories
              min: 0,
              max: 4,  // Shows indexes 0,1,2,3,4 (first 5)
              // Enable scrollbar
              scrollbar: {
                  enabled: true,
                  barBackgroundColor: '#c1c7d0',
                  trackBackgroundColor: '#f5f5f5',
                  buttonBackgroundColor: '#e6e6e6',
                  buttonBorderColor: '#c1c7d0',
                  rifleColor: '#666',
                  height: 14,
                  margin: 5
              }
          },
          yAxis: [{
              min: 0,
              title: {
                  text: ChartOptions.yAxisTitle ? ChartOptions.yAxisTitle : 'Percentage'
              },
              stackLabels: {},
          },
          {
              title: {
                  text: ChartOptions.title,
              },
              opposite: true
          }],
          tooltip: {
              pointFormat: '{series.name}: <b>{point.y:,.1f}</b>',
              outside: true
          },
          plotOptions: {
              column: {
                  stacking: 'normal',
                  pointWidth: 25
              }
          },
          legend: {
              enabled: ChartOptions.legendVisible,
          },
          series: ChartOptions.dataseries,
          credits: {
              enabled: false
          },
      } as Highcharts.Options
  });
  return ChartValues;
}

// 2. Alternative CSS-based solution - Add this to your HTML template:

/*
Replace your existing chart div with this structure:

<div class="scrollable-chart-wrapper">
  <div class="scrollable-chart-content">
      <ng-container *ngFor="let columnChart of swfpColumnChart">
          <highcharts-chart [Highcharts]="columnChart.Highcharts"
              [options]="columnChart.chartOptions"
              [constructorType]="columnChart.chartConstructor">
          </highcharts-chart>
      </ng-container>
  </div>
</div>
*/

// 3. And add this CSS to your SCSS file:

/*
.scrollable-chart-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  
  // Custom scrollbar styling
  &::-webkit-scrollbar {
      height: 12px;
  }
  
  &::-webkit-scrollbar-track {
      background: #f8f9fa;
      border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
      background: #6c757d;
      border-radius: 6px;
      
      &:hover {
          background: #495057;
      }
  }
}

.scrollable-chart-content {
  width: 1200px; // Make this wider to force horizontal scrolling
  min-width: 1200px;
}
*/

// 4. If using the CSS approach, modify your service to have a fixed width:

getStackedColumnChartWithCSSScroll(ChartOptions: any) {
  const outsidethis = this;
  const ChartValues: any = [];
  
  ChartValues.push({
      Highcharts: Highcharts,
      chartConstructor: 'chart',
      chartOptions: {
          title: {
              text: ''
          },
          chart: {
              type: 'column',
              width: 1200, // Fixed width to ensure scrolling
              height: ChartOptions.chartHeight,
              backgroundColor: '#ffffff',
              plotBackgroundColor: '#ffffff',
              plotBorderWidth: 1
          },
          xAxis: {
              categories: ChartOptions.xAxisCategory,
              title: {
                  text: ChartOptions.xAxisTitle
              }
          },
          yAxis: [{
              min: 0,
              title: {
                  text: ChartOptions.yAxisTitle ? ChartOptions.yAxisTitle : 'Percentage'
              },
              stackLabels: {},
          },
          {
              title: {
                  text: ChartOptions.title,
              },
              opposite: true
          }],
          tooltip: {
              pointFormat: '{series.name}: <b>{point.y:,.1f}</b>',
              outside: true
          },
          plotOptions: {
              column: {
                  stacking: 'normal',
                  pointWidth: 60 // Wider bars since we have more space
              }
          },
          legend: {
              enabled: ChartOptions.legendVisible,
          },
          series: ChartOptions.dataseries,
          credits: {
              enabled: false
          },
      } as Highcharts.Options
  });
  return ChartValues;
}