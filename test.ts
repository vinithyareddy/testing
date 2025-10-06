onLoadColumnChart() {
  this.responseFlag = true;

  // Sample data
  const buy = [3, 2.5, 2, 2, 2, 2, 2, 2];
  const build = [9, 5, 6, 5, 5, 5, 4, 4];
  const borrow = [18, 17.5, 14, 14, 13, 13, 12, 12];
  const totals = buy.map((v, i) => v + build[i] + borrow[i]);

  this.chartOptions = {
    chart: {
      type: 'column',
      height: 370,
      spacingTop: 30,
      spacingBottom: 40
    },
    title: { text: undefined },

    xAxis: {
      categories: [
        '2022<br/>Planned', '2022<br/>Actuals', '',
        '2023<br/>Planned', '2023<br/>Actuals', '',
        '2024<br/>Planned', '2024<br/>Actuals', '',
        '2025<br/>Planned', '2025<br/>Actuals'
      ],
      labels: {
        style: { fontSize: '11px', color: '#333' }
      },
      tickLength: 0,
      gridLineWidth: 0,
      lineWidth: 0
    },

    yAxis: [
      {
        title: { text: 'Total Count' },
        min: 0,
        max: 30,
        tickInterval: 5,
        gridLineWidth: 0.5,
        lineWidth: 0,
        labels: { style: { color: '#333' } }
      },
      {
        title: { text: 'Percentage' },
        opposite: true,
        min: 0,
        max: 100,
        tickInterval: 25,
        gridLineWidth: 0,
        lineWidth: 0,
        labels: { format: '{value}%', style: { color: '#333' } }
      }
    ],

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontWeight: '400', color: '#333' }
    },

    tooltip: {
      shared: true,
      formatter: function () {
        const title = String(this.x).replace('<br/>', ' ');
        if (title === '') return false;
        return `<b>${title}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y} (${Math.round(p.percentage)}%)`
          ).join('<br/>');
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        pointPadding: 0.1,
        groupPadding: 0.05,
        pointWidth: 25,
        dataLabels: {
          enabled: true,
          formatter: function () {
            const color = this.series.name === 'Build' ? '#fff' : '#000';
            return this.percentage ? `<span style="color:${color}">${Math.round(this.percentage)}%</span>` : '';
          },
          style: { fontSize: '10px', textOutline: 'none' }
        }
      }
    },

    series: [
      {
        name: 'Borrow',
        type: 'column',
        color: '#95dad9',
        data: [
          borrow[0], borrow[1], null,
          borrow[2], borrow[3], null,
          borrow[4], borrow[5], null,
          borrow[6], borrow[7]
        ],
        stack: 'BBB'
      },
      {
        name: 'Build',
        type: 'column',
        color: '#a392d3',
        data: [
          build[0], build[1], null,
          build[2], build[3], null,
          build[4], build[5], null,
          build[6], build[7]
        ],
        stack: 'BBB'
      },
      {
        name: 'Buy',
        type: 'column',
        color: '#85caf7',
        data: [
          buy[0], buy[1], null,
          buy[2], buy[3], null,
          buy[4], buy[5], null,
          buy[6], buy[7]
        ],
        stack: 'BBB'
      },
      {
        name: 'Total Labels',
        type: 'scatter',
        showInLegend: false,
        enableMouseTracking: false,
        color: 'transparent',
        yAxis: 0,
        data: [
          totals[0], totals[1], null,
          totals[2], totals[3], null,
          totals[4], totals[5], null,
          totals[6], totals[7]
        ],
        dataLabels: {
          enabled: true,
          formatter: function () {
            if (this.y === null) return '';
            return `<b>${this.y}</b>`;
          },
          y: -1,
          verticalAlign: 'bottom',
          crop: false,
          overflow: 'allow',
          style: { fontWeight: '700', color: '#000', fontSize: '11px' }
        }
      }
    ]
  };

  this.swfpColumnChart = [{
    Highcharts: this.Highcharts,
    chartConstructor: 'chart',
    chartOptions: this.chartOptions
  }];
}