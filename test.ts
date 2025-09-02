<!-- Table -->
<ng-container *ngIf="widgetType === 'th'">
  <div class="inner-card-box-lg">
    <table class="custom-table w-100">
      <thead>
        <tr>
          <th>Regions</th>
          <th>Units</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let d of regionData; let i = index" [class.alt-row]="i % 2 === 1">
          <td class="region-col">{{ d.name }}</td>
          <td class="unit-col">
            {{ d.y }} ({{ (d.y / totalCount * 100) | number:'1.0-0' }}%)
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</ng-container>


.custom-table {
  border-collapse: collapse;
  width: 100%;

  th {
    text-align: left;  // ✅ aligns header to left
    font-weight: 600;
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
    background: #f8f9fa;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid #f1f1f1;
  }

  .region-col {
    text-align: left;   // ✅ aligns Regions column left
    font-weight: 500;
  }

  .unit-col {
    text-align: right;  // ✅ keeps Units aligned right
    font-weight: 600;
  }

  // Alternate row coloring
  tr.alt-row {
    background: #fafafa;  // ✅ striped row background
  }
}
