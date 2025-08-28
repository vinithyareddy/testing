.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px 12px;
    font-size: 13px;
    vertical-align: middle;
  }

  thead {
    .tableHeading {
      font-weight: 600;
      color: #2d2d2d;
    }

    th {
      text-align: left;   // default all headers left
    }

    th:last-child {
      text-align: right;  // force FTE header to right
    }
  }

  tbody {
    td {
      text-align: left;   // all cells left by default
    }

    td:last-child {
      text-align: right;  // force FTE values right
    }

    // align expand/collapse icon to extreme left
    .expand-cell {
      display: flex;
      align-items: center;
      gap: 6px; // space between + icon and country text
    }
  }

  .total {
    font-weight: 600;
    background: #f8f8f8;

    td {
      text-align: left;
    }

    td:last-child {
      text-align: right;
    }
  }
}


<td class="expand-cell pointer text-left" (click)="row.expanded = !row.expanded">
  <i class="far" [ngClass]="row.expanded ? 'fa-minus-circle' : 'fa-plus-circle'"></i>
  <img [src]="row.flag" alt="flag" width="18" height="12" />
  {{ row.country }}
</td>
<td>{{ row.fte | number }}</td>
