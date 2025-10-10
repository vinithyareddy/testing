this.updateFlag = true;
setTimeout(() => Highcharts.charts.forEach(c => c?.reflow()), 300);
