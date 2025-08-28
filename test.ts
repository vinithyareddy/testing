onInitLoad(data: any[]): void {
  this.ResponseFlag = true;

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  this.chartOptions = {
    chart: {
      type: 'pie',
      height: 260,
      events: {
        render: function () {
          const chart = this as Highcharts.Chart;
          const centerX = chart.plotWidth / 2 + chart.plotLeft;
          const centerY = chart.plotHeight * 0.75 + chart.plotTop;
          const innerR = 70;
          const outerR = 100;

          // remove old caps if exist
          if ((chart as any).customCaps) {
            (chart as any).customCaps.forEach((c: any) => c.destroy());
          }
          (chart as any).customCaps = [];

          const thickness = (outerR - innerR) / 2;

          // left cap (semi-circle)
          const leftCap = chart.renderer.arc(
            centerX - outerR, centerY,
            thickness, thickness,
            Math.PI / 2, Math.PI * 1.5
          )
            .attr({ fill: '#00796B', stroke: 'none' })
            .add();

          // right cap (semi-circle)
          const rightCap = chart.renderer.arc(
            centerX + outerR, centerY,
            thickness, thickness,
            -Math.PI / 2, Math.PI / 2
          )
            .attr({ fill: '#4DB6AC', stroke: 'none' })
            .add();

          (chart as any).customCaps.push(leftCap, rightCap);
        }
      }
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true,
      y: 40,
      text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/>
             <span style="font-size:12px">By FCV Status</span>`,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
    },
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
        borderRadius: 0,   // straight middle
        showInLegend: true,
        dataLabels: {
          enabled: true,
          distance: 15,
          format: '{y} ({point.percentage:.0f}%)',
          style: { fontSize: '12px' }
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
      },
    },
    series: [
      {
        type: 'pie',
        name: 'FCV Status',
        data: data.map((d) => ({
          name: d.name,
          y: d.value,
          color: d.color,
        })),
      },
    ],
  };
}
