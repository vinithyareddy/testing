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
      spacingTop: 20,
      spacingBottom: 10,
      marginTop: 20,
      marginBottom: 90,
      events: {
        load: function() {
          const chart = this;
          const xAxis = chart.xAxis[0];
          
          // Add year labels manually
          const years = ['2022', '2023', '2024', '2025'];
          const positions = [0.5, 2.5, 4.5, 6.5];  // Updated positions (no gaps)
          
          years.forEach((year, i) => {
            const label = chart.renderer.text(year, 0, 0)
              .attr({
                align: 'center'
              })
              .css({
                fontSize: '12px',
                color: '#333',
                fontWeight: '400'
              })
              .add();
            
            const x = xAxis.toPixels(positions[i], false);
            const y = chart.plotTop + chart.plotHeight + 35;
            label.attr({ x: x, y: y });
          });
        }
      }
    },
    title: { text: undefined },

    xAxis: {
      categories: [
        'Planned', 'Actuals',  // No gap
        'Planned', 'Actuals',
        'Planned', 'Actuals',
        'Planned', 'Actuals'
      ],
      labels: {
        style: { fontSize: '11px', color: '#333' },
        y: 15
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
      itemStyle: { fontWeight: '400', color: '#333' },
      itemMarginTop: 5,
      itemMarginBottom: 0
    },

    tooltip: {
      shared: true,
      formatter: function () {
        const title = String(this.x);
        if (title === '') return false;
        
        // Determine year based on point index
        const index = this.points?.[0]?.point?.index || 0;
        const year = index < 2 ? '2022' : index < 4 ? '2023' : index < 6 ? '2024' : '2025';
        
        return `<b>${year} ${title}</b><br/>` +
          this.points?.map((p: any) =>
            `${p.series.name}: ${p.y} (${Math.round(p.percentage)}%)`
          ).join('<br/>');
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        pointPadding: 0.05,      // Small gap within year
        groupPadding: 0.15,      // Gap between year groups
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
        data: borrow,  // No nulls
        stack: 'BBB'
      },
      {
        name: 'Build',
        type: 'column',
        color: '#a392d3',
        data: build,  // No nulls
        stack: 'BBB'
      },
      {
        name: 'Buy',
        type: 'column',
        color: '#85caf7',
        data: buy,  // No nulls
        stack: 'BBB'
      },
      {
        name: 'Total Labels',
        type: 'scatter',
        showInLegend: false,
        enableMouseTracking: false,
        color: 'transparent',
        yAxis: 0,
        data: totals,  // No nulls
        dataLabels: {
          enabled: true,
          formatter: function () {
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