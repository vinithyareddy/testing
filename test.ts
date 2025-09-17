<div class="content-area">

  <!-- Arrows only for chart -->
  <button *ngIf="currentView === 'chart'" class="nav-arrow left-arrow" (click)="prevItem()">
    <i class="fa fa-chevron-left"></i>
  </button>

  <!-- Chart -->
  <highcharts-chart *ngIf="currentView === 'chart'"
    [Highcharts]="Highcharts"
    [options]="chartOptions"
    style="width: 95%; height: 290px; display: block;">
  </highcharts-chart>

  <!-- Table -->
  <table *ngIf="currentView === 'table'" class="data-table">
    <thead>
      <tr>
        <th>Position</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let row of (data.length > pageSize ? data.slice(currentIndex, currentIndex + pageSize) : data)">
        <td>{{ row.position }}</td>
        <td>{{ row.amount }}</td>
      </tr>
    </tbody>
  </table>

  <!-- Arrows only for chart -->
  <button *ngIf="currentView === 'chart'" class="nav-arrow right-arrow" (click)="nextItem()">
    <i class="fa fa-chevron-right"></i>
  </button>

</div>
