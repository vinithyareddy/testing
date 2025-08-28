onInitLoad(data: any[]): void {
  this.ResponseFlag = true;

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const fcv = data.find((d) => d.name === 'FCV')?.value || 0;
  const nonFcv = data.find((d) => d.name === 'Non-FCV')?.value || 0;

  const fcvPercent = fcv / total;
  const nonFcvPercent = nonFcv / total;

  // ✅ Gradient for one slice
  const gradient: Highcharts.GradientColorObject = {
    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
    stops: [
      [0, data[0].color],
      [fcvPercent, data[0].color],
      [fcvPercent, data[1].color],
      [1, data[1].color],
    ],
  };

  this.chartOptions = {
    chart: {
      type: 'pie',
      height: 260,
      events: {
        render: function () {
          const chart = this;

          // Remove old custom labels before re-rendering
          chart.renderer.labelGroup?.destroy();

          const labelGroup = chart.renderer.g('custom-labels').add();
          (chart as any).renderer.labelGroup = labelGroup;

          // Compute arc positions for labels
          const centerX = chart.plotWidth / 2 + chart.plotLeft;
          const centerY = chart.plotHeight * 0.75 + chart.plotTop;
          const radius = 100;

          // Left label (FCV)
          const fcvAngle = Math.PI * (0.5 + fcvPercent); // half circle start offset
          const fcvX = centerX - Math.cos(fcvAngle) * radius;
          const fcvY = centerY - Math.sin(fcvAngle) * radius;

          chart.renderer
            .text(`${fcv} (${Math.round(fcvPercent * 100)}%)`, fcvX - 40, fcvY)
            .css({ fontSize: '12px' })
            .add(labelGroup);

          // Right label (Non-FCV)
          const nonX = centerX + Math.cos(fcvAngle) * radius;
          const nonY = fcvY;

          chart.renderer
            .text(`${nonFcv} (${Math.round(nonFcvPercent * 100)}%)`, nonX + 10, nonY)
            .css({ fontSize: '12px' })
            .add(labelGroup);
        },
      },
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true,
      y: 40,
      text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/>
             <span style="font-size:12px">By FCV Status</span>`,
    },
    tooltip: { enabled: false },
    credits: { enabled: false },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      symbolRadius: 6,
      itemStyle: { fontSize: '12px' },
    },
    plotOptions: {
      pie: {
        innerSize: '70%',
        borderRadius: 10,
        dataLabels: { enabled: false },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
      },
    },
    series: [
      {
        type: 'pie',
        data: [
          {
            name: 'FCV Split',
            y: 100,
            color: gradient as Highcharts.ColorType,
          },
        ],
        showInLegend: true,
        // ✅ Legend items from dummy data
        keys: ['name', 'y', 'color'],
        dataLabels: { enabled: false },
      } as any,
    ],
  };
}
