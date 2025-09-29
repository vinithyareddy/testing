<div class="togglebtn d-flex">
    <div class="lft-toggle" [class.lft-toggle-active]="viewMode === 'table'" (click)="viewMode = 'table'">
        <i class="fa fa-table fnticon" aria-hidden="true"></i>
    </div>
    <div class="rgt-toggle" [class.rgt-toggle-active]="viewMode === 'chart'" (click)="viewMode = 'chart'">
        <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
    </div>
</div>




<div style="flex-grow: 1;">
    <ng-container class="chart-section">
        <!-- Chart View -->
        <highcharts-chart *ngIf="viewMode === 'chart'"
            [Highcharts]="Highcharts" [options]="chartOptions"
            style="width: 99%; height: 330px; display: block;">
        </highcharts-chart>

        <!-- Table View -->
        <table *ngIf="viewMode === 'table'" class="table table-bordered table-striped mt-2">
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
    </ng-container>
</div>
