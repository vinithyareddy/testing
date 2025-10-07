<ng-container *ngIf="widgetType === 'linechart'">
  <highcharts-chart
    [Highcharts]="Highcharts"
    [options]="chartOptions"
    style="width: 100%; height: 350px; display: block;">
  </highcharts-chart>
</ng-container>


onLoadLineChart() {
  this.responseFlag = true;

  // --- Same data as column chart ---
  const buy = [3, 2.5, 2, 3, 6, 2, 5, 2];
  const build = [9, 5, 6, 5, 3, 5, 4, 5];
  const borrow = [18, 17.5, 14, 10, 13, 9, 12, 10];

  // --- Create chart options ---
  this.chartOptions = {
    chart: {
      type: 'spline',  // line chart type
      height: 330,
      spacingTop: 20,
      spacingBottom: 10,
      marginTop: 20,
      marginBottom: 90,
      events: {
        load: function () {
          const chart = this;
          const xAxis = chart.xAxis[0];
          const years = ['2022', '2023', '2024', '2025'];
          const positions = [0.5, 2.5, 4.5, 6.5];

          years.forEach((year, i) => {
            const label = chart.renderer.text(year, 0, 0)
              .attr({ align: 'center' })
              .css({ fontSize: '12px', color: '#333', fontWeight: '400' })
              .add();

            const x = xAxis.toPixels(positions[i], false);
            const y = chart.plotTop + chart.plotHeight + 35;
            label.attr({ x, y });
          });
        }
      }
    },

    title: { text: undefined },
    credits: { enabled: false },

    xAxis: {
      categories: [
        'Planned', 'Actuals',
        'Planned', 'Actuals',
        'Planned', 'Actuals',
        'Planned', 'Actuals'
      ],
      labels: { style: { fontSize: '11px', color: '#333' }, y: 15 },
      tickLength: 0,
      gridLineWidth: 0,
      lineWidth: 0
    },

    yAxis: [{
      title: { text: 'Total Count' },
      min: 0,
      max: 30,
      tickInterval: 5,
      gridLineWidth: 0.5,
      lineWidth: 0,
      labels: { style: { color: '#333' } }
    }, {
      title: { text: 'Percentage' },
      opposite: true,
      min: 0,
      max: 100,
      tickInterval: 25,
      gridLineWidth: 0,
      lineWidth: 0,
      labels: { format: '{value}%', style: { color: '#333' } }
    }],

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' },
      itemMarginTop: 5
    },

    tooltip: {
      shared: true,
      formatter: function () {
        const title = String(this.x);
        if (!title) return false;
        const index = this.points?.[0]?.point?.index ?? 0;
        const year = index < 2 ? '2022'
          : index < 4 ? '2023'
          : index < 6 ? '2024'
          : '2025';
        return `<b>${year} ${title}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y}`
          ).join('<br/>');
      }
    },

    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 3
        },
        dataLabels: {
          enabled: false
        }
      }
    },

    series: [
      { name: 'Borrow', type: 'spline', color: '#95dad9', data: borrow },
      { name: 'Build', type: 'spline', color: '#a392d3', data: build },
      { name: 'Buy', type: 'spline', color: '#85caf7', data: buy }
    ]
  };
}
