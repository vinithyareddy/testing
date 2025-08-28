events: {
  render: function () {
    const chart = this as Highcharts.Chart;
    const centerX = chart.plotWidth / 2 + chart.plotLeft;
    const centerY = chart.plotHeight * 0.75 + chart.plotTop;
    const outerR = 100;
    const innerR = 70;

    // Remove old caps if exist
    if ((chart as any).customCaps) {
      (chart as any).customCaps.forEach((c: any) => c.destroy());
    }
    (chart as any).customCaps = [];

    // Thickness of arc
    const thickness = (outerR - innerR) / 2;

    // Left cap
    const leftCap = chart.renderer.circle(centerX - outerR, centerY, thickness)
      .attr({ fill: '#00796B' }) // FCV color
      .add();

    // Right cap
    const rightCap = chart.renderer.circle(centerX + outerR, centerY, thickness)
      .attr({ fill: '#4DB6AC' }) // Non-FCV color
      .add();

    (chart as any).customCaps.push(leftCap, rightCap);
  }
}
