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
              // Enable scrollable plot area - this creates a horizontal scrollbar
              scrollablePlotArea: {
                  minWidth: 800,  // Make this wider than your chart width to force scrolling
                  scrollPositionX: 0
              }
          },
          xAxis: {
              categories: ChartOptions.xAxisCategory,
              title: {
                  text: ChartOptions.xAxisTitle
              },
              // Remove min/max to let all categories render in the scrollable area
              tickmarkPlacement: 'on'
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



// Alternative approach - wrap the chart in a scrollable container
// Add this to your component HTML template

// Replace your existing chart container div with this:
/*
<div class="chart-scroll-container">
    <div class="chart-inner-container">
        <ng-container *ngFor="let columnChart of swfpColumnChart">
            <highcharts-chart [Highcharts]="columnChart.Highcharts"
                [options]="columnChart.chartOptions"
                [constructorType]="columnChart.chartConstructor">
            </highcharts-chart>
        </ng-container>
    </div>
</div>
*/

// And add this CSS to your component SCSS:
/*
.chart-scroll-container {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.chart-inner-container {
    width: 800px; // Make this wider than your actual chart width to force scrolling
    min-width: 800px;
}
*/

// Then modify your service method like this:
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
              width: 800, // Fixed width larger than container to force scrolling
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
                  pointWidth: 40 // Make bars wider since we have more space
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