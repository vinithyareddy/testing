<highcharts-chart 
    *ngIf="allCategories.length > 0"
    [Highcharts]="Highcharts"
    [options]="chartOptions" 
    style="width: 99%; height: 330px; display: block;">
</highcharts-chart>