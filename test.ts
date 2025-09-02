<!-- Chart -->
<ng-container *ngIf="widgetType === 'ch'">
  <div class="inner-card-box">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      [constructorType]="'chart'"
      style="width: 100%; height: 310px; display: block;">
    </highcharts-chart>
  </div>
</ng-container>

<!-- Table -->
<ng-container *ngIf="widgetType === 'th'">
  <div class="inner-card-box">
    <table class="custom-table w-100">
      <thead>
        <tr>
          <th>Age</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let d of ageData; let i = index" [class.alt-row]="i % 2 === 1">
          <td class="age-col">{{ d.category }}</td>
          <td class="percent-col">{{ d.percent }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</ng-container>


.custom-table {
  border-collapse: collapse;
  width: 100%;

  th {
    text-align: left;
    font-weight: 600;
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
    background: #f8f9fa;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid #f1f1f1;
  }

  .age-col {
    text-align: left;
    font-weight: 500;
  }

  .percent-col {
    text-align: right;
    font-weight: 600;
  }

  tr.alt-row {
    background: #fafafa; // alternate row shading
  }
}
