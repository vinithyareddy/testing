this.chartOptions = {
    chart: {
      type: 'column',
      backgroundColor: '#ffffff',
      events: {
        render() {
          const chart = this as any;
  
          // Remove old label if it exists
          if (chart.customLegendTitle) {
            chart.customLegendTitle.destroy();
          }
  
          // Compute legend position and add static text before legend
          if (chart.legend && chart.legend.group) {
            const legendX = chart.legend.group.translateX;
            const legendY = chart.legend.group.translateY;
  
            // Add “Proficiency Level:” before legend
            chart.customLegendTitle = chart.renderer
              .text('Proficiency Level:', legendX - 120, legendY + 12)
              .css({
                fontWeight: '600',
                color: '#051223', // change to #636b76 if you prefer gray
                fontSize: '13px'
              })
              .add();
          }
        }
      }
    },
  
    title: { text: '' },
    credits: { enabled: false },
  
    xAxis: {
      categories: pageCategories,
      title: {
        text: '',
        style: { color: '#636b76', fontWeight: 'bold', fontSize: '13px' }
      },
      labels: {
        style: { color: '#636b76', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
  
    yAxis: {
      min: 0,
      title: {
        text: 'Staff Count',
        style: { color: '#051223', fontWeight: 'bold', fontSize: '13px' }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
  
    tooltip: { shared: true },
  
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          inside: false,
          y: -5,
          formatter: function (this: any) {
            if (this.y > 0) return this.y;
          },
          style: {
            fontWeight: '600',
            textOutline: 'none'
          }
        }
      }
    },
  
    legend: {
      enabled: true,
      align: 'center',
      layout: 'horizontal',
      verticalAlign: 'bottom',
      useHTML: true,
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
  
    // ✅ keep your existing series block as-is
    series: pageSeriesData.map((data, idx) => ({
      type: 'column',
      pointWidth: 22,
      name: seriesNames[idx],
      color: colors[idx],
      data
    }))
  };
  