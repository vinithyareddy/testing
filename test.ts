.content-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;   // give a baseline height
  height: 100%;
}

.inner-card-box {
  flex: 1;
  padding: 1rem;       // scalable padding instead of fixed 40px
  min-height: 250px;   // safe minimum
}


import { HostListener } from '@angular/core';

@HostListener('window:resize')
onResize() {
  if (this.Highcharts && (Highcharts as any).charts) {
    (Highcharts as any).charts.forEach((chart: any) => {
      if (chart) {
        chart.reflow();
      }
    });
  }
}
