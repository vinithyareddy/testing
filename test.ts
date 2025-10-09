<span class="prevButton"
      [class.disabled]="isLeftDisabled"
      (click)="onLeftClick()">
  <i class="fa-solid fa-angle-left"></i>
</span>

<ng-container class="chart-section">
  <highcharts-chart
    [Highcharts]="Highcharts"
    [options]="chartOptions"
    style="width: 99%; height: 380px; display: block;">
  </highcharts-chart>
</ng-container>

<span class="nextButton"
      [class.disabled]="isRightDisabled"
      (click)="onRightClick()">
  <i class="fa-solid fa-angle-right"></i>
</span>


.prevButton,
.nextButton {
  cursor: pointer;
  font-size: 20px;
  color: #374151; // dark gray
  transition: 0.2s;

  &:hover {
    color: #111827; // darker on hover
  }

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: not-allowed;
  }
}
