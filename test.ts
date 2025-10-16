legend: {
    enabled: true,
    align: 'center',
    layout: 'horizontal',
    verticalAlign: 'bottom',
    useHTML: false,
    symbolPadding: 5,
    itemDistance: 20,
    itemStyle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#051223'
    },
    events: {
      itemClick: function (event: any) {
        event.preventDefault();
      }
    },
    margin: 10
  },
  chart: {
    type: 'column',
    backgroundColor: '#ffffff',
    events: {
      render: function () {
        const chart = this;
        // Remove old label if it exists
        if (chart.customLegendTitle) chart.customLegendTitle.destroy();
  
        // Compute legend position
        if (chart.legend && chart.legend.group) {
          const legendX = chart.legend.group.translateX;
          const legendY = chart.legend.group.translateY;
  
          // Add static text before the legend
          chart.customLegendTitle = chart.renderer
            .text('Proficiency Level:', legendX - 130, legendY + 12)
            .css({
              fontWeight: '600',
              color: '#051223',
              fontSize: '13px'
            })
            .add();
        }
      }
    }
  }
  