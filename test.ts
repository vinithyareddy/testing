chart: {
  type: 'pie',
  height: 260,
  events: {
    render: function () {
      const chart = this;
      const centerX = chart.plotWidth / 2 + chart.plotLeft;
      const centerY = chart.plotHeight * 0.75 + chart.plotTop;
      const innerR = 70;   // inner radius
      const outerR = 100;  // outer radius

      // remove old custom line
      if ((chart as any).customMidLine) {
        (chart as any).customMidLine.destroy();
      }

      // draw a straight line at the middle (vertical)
      const path = [
        'M', centerX, centerY - outerR,
        'L', centerX, centerY - innerR
      ];

      (chart as any).customMidLine = chart.renderer.path(path)
        .attr({
          'stroke-width': 2,
          stroke: '#fff',   // separator color (white usually)
        })
        .add();
    }
  }
},
