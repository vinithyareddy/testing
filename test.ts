<!-- Chart -->
<ng-container *ngIf="widgetType === 'ch'">
  <div class="inner-card-box-lg">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 320px; display: block;">
    </highcharts-chart>
  </div>
</ng-container>

<!-- Table -->
<ng-container *ngIf="widgetType === 'th'">
  <div class="inner-card-box-lg">
    <table class="table table-sm table-bordered w-100">
      <thead>
        <tr>
          <th>Regions</th>
          <th>Units</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let d of regionData">
          <td>{{ d.name }}</td>
          <td>{{ d.y }} ({{ (d.y / totalCount * 100) | number:'1.0-0' }}%)</td>
        </tr>
      </tbody>
    </table>
  </div>
</ng-container>

loadWidget(type: 'ch' | 'th') {
  this.widgetType = type;
  if (type === 'ch') {
    this.loadChart();
  }
}
