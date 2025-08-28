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

    th:first-child {
      text-align: left;
      padding-left: 8px;   // keep expand icon flush left
    }

    th:last-child {
      text-align: right;   // align FTE header to far right
      padding-right: 16px;
    }
  }

  tbody {
    td:first-child {
      display: flex;
      align-items: center;
      gap: 8px;            // space between icon, flag, and text
      text-align: left;
      padding-left: 8px;   // push + icon flush left
    }

    td:last-child {
      text-align: right;   // align FTE values to right edge
      padding-right: 16px;
    }
  }

  .total {
    font-weight: 600;
    background: #f8f8f8;

    td:first-child {
      padding-left: 8px;
    }

    td:last-child {
      text-align: right;
      padding-right: 16px;
    }
  }
}
