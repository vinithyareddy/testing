.TableView {
  max-height: 335px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 20px;

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    /* 🔑 add these to close the gaps */
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;

    th,
    td {
      padding: 8px 12px;
      font-size: 13px;
      vertical-align: middle;
      white-space: nowrap;
    }

    tbody tr:nth-of-type(odd) {
      background-color: #fff;
    }

    tbody tr:nth-of-type(even) {
      background-color: #f4f6f9;
    }

    tbody tr:hover {
      background-color: #eef5ff;
    }

    thead th {
      font-weight: 600;
      color: #2d2d2d;
      background-color: #f4f6f9;
      position: sticky;
      top: 0;
      z-index: 2;

      /* 🔑 keep header aligned with table border */
      border-bottom: 1px solid #e0e0e0;
    }

    tfoot tr.total {
      font-weight: 600;
      background: #f4f6f9;
      color: #2d2d2d;
      position: sticky;
      bottom: 0;
      z-index: 2;

      /* 🔑 keep footer aligned with table border */
      border-top: 1px solid #e0e0e0;
    }
  }
}
