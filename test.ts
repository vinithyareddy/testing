<!-- Chart mode stays inside the styled box -->
<div class="inner-chart-box" *ngIf="viewMode === 'chart'">
    <span class="prevButton">
        <a><i class="fa-solid fa-angle-left"></i></a>
    </span>

    <div style="flex-grow: 1;">
        <ng-container class="chart-section">
            <highcharts-chart
                [Highcharts]="Highcharts" [options]="chartOptions"
                style="width: 99%; height: 330px; display: block;">
            </highcharts-chart>
        </ng-container>
    </div>

    <span>
        <a class="nextButton"><i class="fa-solid fa-angle-right"></i></a>
    </span>
</div>

<!-- Table mode OUTSIDE the chart box -->
<table *ngIf="viewMode === 'table'" class="table table-bordered table-striped mt-3 w-100">
    <thead>
        <tr>
            <th>Proficiency Level</th>
            <th *ngFor="let name of ['Awareness','Skilled','Advanced','Expert']">{{name}}</th>
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let category of allCategories; let i = index">
            <td>{{category}}</td>
            <td *ngFor="let series of allSeriesData">{{series[i]}}</td>
        </tr>
    </tbody>
</table>



table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    text-align: center;
    padding: 6px 10px;
  }
}
