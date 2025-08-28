.TableView {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 20px;

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    th, td {
      padding: 8px 12px;
      font-size: 13px;
      vertical-align: middle;
      white-space: nowrap;
    }

    // 🔹 Apply zebra striping (row background colors)
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;   // light grey
    }

    tbody tr:nth-child(odd) {
      background-color: #ffffff;   // white
    }

    // Keep header consistent
    thead {
      th {
        font-weight: 600;
        color: #2d2d2d;
        background-color: #f2f2f2; // optional grey background for header
      }
    }

    // First col → Location
    th:first-child,
    td:first-child {
      width: calc(100% - 100px);
      text-align: left;
      padding-left: 12px;

      .cell-content {
        display: inline-flex;
        align-items: center;
        gap: 8px;   // space between + icon, flag, text
      }
    }

    // Last col → FTE
    th:last-child,
    td:last-child {
      width: 100px;
      text-align: right;
      padding-right: 20px;
    }

    // Total row should override striping
    .total {
      font-weight: 600;
      background: #eaeaea !important;

      td:first-child {
        padding-left: 12px;
      }
      td:last-child {
        text-align: right;
        padding-right: 20px;
      }
    }
  }
}
