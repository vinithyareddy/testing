isLeftDisabled = true;
isRightDisabled = false;


updateChart() {
  const start = this.currentPage * this.pageSize;
  const end = start + this.pageSize;

  const updatedOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: this.allCategories.slice(start, end),
      title: {
        text: 'Nationality',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
      },
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' },
      },
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Workforce Supply (FTE)',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB',
    },
    plotOptions: {
      column: {
        pointWidth: 20,
        dataLabels: { enabled: true },
      },
    },
    series: [
      {
        type: 'column',
        showInLegend: false,
        color: '#59529bff',
        data: this.allData.slice(start, end),
      },
    ],
  };

  this.chartOptions = updatedOptions;

  // ✅ Update legend text
  this.legendText = `${start + 1}–${Math.min(
    end,
    this.allCategories.length
  )} out of ${this.allCategories.length} countries`;

  // ✅ Update button disable states
  this.isLeftDisabled = this.currentPage === 0;
  const maxPage = Math.ceil(this.allCategories.length / this.pageSize) - 1;
  this.isRightDisabled = this.currentPage >= maxPage;
}

prevPage() {
  if (!this.isLeftDisabled) {
    this.currentPage--;
    this.updateChart();
  }
}

nextPage() {
  if (!this.isRightDisabled) {
    this.currentPage++;
    this.updateChart();
  }
}


<span class="prevButton"
      [class.disabled]="isLeftDisabled"
      (click)="prevPage()">
  <i class="fa-solid fa-angle-left"></i>
</span>

<div style="flex-grow: 1;">
  <ng-container class="chart-section">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 99%; height: 330px; display: block;">
    </highcharts-chart>
  </ng-container>
</div>

<span class="nextButton"
      [class.disabled]="isRightDisabled"
      (click)="nextPage()">
  <i class="fa-solid fa-angle-right"></i>
</span>


.prevButton,
.nextButton {
  background-color: #eef1fa;
  padding: 3px 6px;
  border: 1px solid rgb(117, 117, 235);
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #dbeafe;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }
}

const totalLength = this.filteredCategories.length || this.allCategories.length;
