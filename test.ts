<td class="pointer text-left" (click)="expandRow(row)">
  <span class="cell-content">
    <i *ngIf="!row.expanded" class="far fa-plus-circle"></i>
    <i *ngIf="row.expanded" class="far fa-minus-circle"></i>
    <img [src]="'https://flagcdn.com/16x12/' + row.flag + '.png'" class="flag-icon" />
    {{ row.country }}
  </span>
</td>
<td class="fte-col">{{ row.fte }}</td>


.TableView {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 18px;

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; // 🔑 keeps columns consistent

    th, td {
      padding: 8px 12px;
      font-size: 13px;
      vertical-align: middle;
      white-space: nowrap;
    }

    // 🔹 Column widths locked
    th:first-child, td:first-child {
      width: calc(100% - 100px); // everything except FTE col
    }

    th:last-child, td.fte-col {
      width: 100px;              // FTE col fixed
      text-align: right;
      padding-right: 20px;
    }

    tbody td:first-child .cell-content {
      display: inline-flex;
      align-items: center;
      gap: 8px;  // space between + icon, flag, and text
    }
  }
}
