.TableView {
  max-height: 220px;   // keeps table smaller
  overflow-y: auto;    // enables vertical scroll
  overflow-x: hidden;  // no horizontal scroll
  margin-bottom: 16px; // gap before "View More"

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;   // 🔑 ensures straight column lines

    th, td {
      padding: 8px 12px;
      font-size: 13px;
      vertical-align: middle;
      border-bottom: 1px solid #e0e0e0;
    }

    thead {
      th {
        font-weight: 600;
        color: #2d2d2d;
      }

      th:first-child {
        width: 75%;       // Location column wider
        text-align: left;
        padding-left: 16px;  // consistent left padding
      }

      th:last-child {
        width: 25%;       // FTE column
        text-align: right;
        padding-right: 16px;
      }
    }

    tbody {
      td:first-child {
        display: flex;
        align-items: center;
        gap: 8px;         
        text-align: left;
        padding-left: 16px; // same as header → keeps lines aligned
      }

      td:last-child {
        text-align: right;
        padding-right: 16px; // same as header → keeps lines aligned
      }
    }

    .total {
      font-weight: 600;
      background: #f8f8f8;
    }
  }
}
