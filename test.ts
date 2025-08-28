events: {
  render: function () {
    const chart = this as Highcharts.Chart;

    // cleanup old caps
    if ((chart as any).customCaps) {
      (chart as any).customCaps.forEach((c: any) => c.destroy());
    }
    (chart as any).customCaps = [];

    const series = chart.series[0];
    if (!series || !series.points) return;

    series.points.forEach((point, idx) => {
      const args: any = point.shapeArgs;
      if (!args) return;

      // get arc mid-angle at start/end
      const startAngle = args.start;
      const endAngle = args.end;
      const centerX = args.x;
      const centerY = args.y;
      const outerR = args.r;
      const innerR = args.innerR;
      const capRadius = (outerR - innerR) / 2;

      // outer end (first slice left side)
      if (idx === 0) {
        const x = centerX + Math.cos(startAngle) * outerR;
        const y = centerY + Math.sin(startAngle) * outerR;
        const cap = chart.renderer.circle(x, y, capRadius)
          .attr({ fill: point.color, stroke: 'none' })
          .add();
        (chart as any).customCaps.push(cap);
      }

      // outer end (last slice right side)
      if (idx === series.points.length - 1) {
        const x = centerX + Math.cos(endAngle) * outerR;
        const y = centerY + Math.sin(endAngle) * outerR;
        const cap = chart.renderer.circle(x, y, capRadius)
          .attr({ fill: point.color, stroke: 'none' })
          .add();
        (chart as any).customCaps.push(cap);
      }
    });
  }
}
