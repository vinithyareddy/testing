events: {
  render: function () {
    const chart = this;

    // Clean old labels
    if ((chart as any).customLabelGroup) {
      (chart as any).customLabelGroup.destroy();
    }

    const labelGroup = chart.renderer.g('custom-labels').add();
    (chart as any).customLabelGroup = labelGroup;

    const centerX = chart.plotWidth / 2 + chart.plotLeft;
    const centerY = chart.plotHeight * 0.75 + chart.plotTop;
    const radius = 100;

    // Example: left label (FCV)
    const fcvValue = 104; // replace with dynamic fcv from data
    const fcvPercent = 70;
    chart.renderer
      .text(`${fcvValue} (${fcvPercent}%)`, centerX - radius - 20, centerY - 20)
      .css({ fontSize: '12px' })
      .add(labelGroup);

    // Example: right label (Non-FCV)
    const nonValue = 44;
    const nonPercent = 30;
    chart.renderer
      .text(`${nonValue} (${nonPercent}%)`, centerX + radius - 20, centerY - 20)
      .css({ fontSize: '12px' })
      .add(labelGroup);
  },
},
