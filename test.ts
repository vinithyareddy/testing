<thead class="tableHeading">
  <tr>
    <th class="text-left">Location and Job</th>
    <th class="fte-col">FTE</th>
  </tr>
</thead>
<tbody>
  <tr *ngFor="let row of groupdata">
    <td class="pointer text-left" (click)="expandRow(row)">
      <i *ngIf="!row.expanded" class="far fa-plus-circle"></i>
      <i *ngIf="row.expanded" class="far fa-minus-circle"></i>
      <img [src]="'https://flagcdn.com/16x12/' + row.flag + '.png'" class="flag-icon" />
      &nbsp;{{ row.country }}
    </td>
    <td class="fte-col">{{ row.fte }}</td>   <!-- ✅ add class here -->
  </tr>

  <tr *ngFor="let t of total" class="total">
    <td class="text-left">{{ t.label }}</td>
    <td class="fte-col">{{ t.fte }}</td>     <!-- ✅ add class here -->
  </tr>
</tbody>


.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px 12px;
    font-size: 13px;
    vertical-align: middle;
  }

  .fte-col {
    text-align: right !important;   // force alignment
    padding-right: 20px;
    width: 100px;                   // optional: give column fixed width so it hugs right edge
  }

  td:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    padding-left: 8px;
  }

  .total {
    font-weight: 600;
    background: #f8f8f8;
  }
}
