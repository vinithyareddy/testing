// at the top of total-action-trend.component.ts
import Highcharts from 'highcharts';
import GroupedCategories from 'highcharts-grouped-categories';
GroupedCategories(Highcharts);   // enable hierarchical categories



onLoadColumnChart() {
  this.responseFlag = true;

  // Sample data
  const buy = [3, 2.5, 2, 2, 2, 2, 2, 2];
  const build = [9, 5, 6, 5, 5, 5, 4, 4];
  const borrow = [18, 17.5, 14, 14, 13, 13, 12, 12];
  const totals = buy.map((v, i) => v + build[i] + borrow[i]); // auto sum

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 350,
    },
    title: { text: undefined },

    // ✅ Grouped X-axis (Year + Planned/Actuals)
    xAxis: {
      categories: [
        { name: '2022', categories: ['Planned', 'Actuals'] },
        { name: '2023', categories: ['Planned', 'Actuals'] },
        { name: '2024', categories: ['Planned', 'Actuals'] },
        { name: '2025', categories: ['Planned', 'Actuals'] }
      ],
      labels: {
        style: { fontSize: '12px', color: '#333' }
      }
    },

    // ✅ Two Y-axes
    yAxis: [
      {
        title: { text: 'Total Count' },
        min: 0,
        max: 30,
        tickInterval: 5,
        labels: { style: { color: '#333' } }
      },
      {
        title: { text: 'Percentage' },
        min: 0,
        max: 100,
        tickInterval: 30,
        opposite: true,
        labels: { format: '{value}%', style: { color: '#333' } }
      }
    ],

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' }
    },

    // ✅ Tooltip with safe casting
    tooltip: {
      shared: true,
      formatter: function () {
        const title = String(this.x);
        return `<b>${title}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y} (${Math.round(p.percentage)}%)`
          ).join('<br/>');
      }
    },

    // ✅ Bar layout, padding, labels
    plotOptions: {
      column: {
        stacking: 'percent',
        borderWidth: 0,
        pointPadding: 0.05,
        groupPadding: 0.20,
        pointWidth: 12, // thin bars
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.percentage ? `${Math.round(this.percentage)}%` : '';
          },
          style: { fontSize: '10px', textOutline: 'none', color: '#000' }
        }
      }
    },

    // ✅ 3 colors + auto total labels
    series: [
      {
        name: 'Buy',
        type: 'column',
        color: '#4A90E2',
        data: buy,
        stack: 'bbb'
      },
      {
        name: 'Build',
        type: 'column',
        color: '#7B68EE',
        data: build,
        stack: 'bbb'
      },
      {
        name: 'Borrow',
        type: 'column',
        color: '#5CC4A2',
        data: borrow,
        stack: 'bbb'
      },
      {
        type: 'scatter',
        showInLegend: false,
        enableMouseTracking: false,
        color: 'transparent',
        yAxis: 0,
        data: totals,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `<b>${totals[this.point.index]}</b>`;
          },
          y: -22,
          style: { fontWeight: '700', color: '#000', fontSize: '11px' }
        }
      }
    ]
  };

  // ✅ Assign chart object
  this.swfpColumnChart = [{
    Highcharts: this.Highcharts,
    chartConstructor: 'chart',
    chartOptions: this.chartOptions
  }];
}
