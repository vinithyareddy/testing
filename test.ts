.TableView {
  max-height: 220px;   // keeps table smaller
  overflow-y: auto;    // enables vertical scroll
  overflow-x: hidden;  // no horizontal scroll
  margin-bottom: 16px; // gap before "View More"

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; // keeps columns aligned

    th, td {
      padding: 8px 12px;
      font-size: 13px;
      vertical-align: middle;
      white-space: nowrap;
    }

    thead {
      th:first-child {
        text-align: left;
        padding-left: 8px;   // 🔑 same as td:first-child → keeps plus icons aligned
      }

      th:last-child {
        text-align: right;
        padding-right: 20px; // 🔑 same as td:last-child → keeps FTE aligned
      }
    }

    tbody {
      td:first-child {
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: left;
        padding-left: 8px;   // match header
      }

      td:last-child {
        text-align: right;
        padding-right: 20px; // match header
      }
    }

    .fte-col {
      width: 100px;
      text-align: right !important;
      padding-right: 20px;
    }

    .total {
      font-weight: 600;
      background: #f8f8f8;

      td:first-child {
        padding-left: 8px;
      }

      td:last-child {
        text-align: right;
        padding-right: 20px;
      }
    }
  }
}
