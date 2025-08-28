.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  .ellipsis {
    cursor: pointer;
  }

  .TableView {
    max-height: 300px;   // keeps table smaller
    overflow-y: auto;    // enables vertical scroll
    overflow-x: hidden;  // no horizontal scroll
    margin-bottom: 18px; // gap before "View More"

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

      // 🔹 Column widths
      th:first-child,
      td:first-child {
        width: auto;
        text-align: left;
        padding-left: 12px;
      }

      // 🔹 Force FTE column to the extreme right
      th.fte-col,
      td.fte-col {
        width: 1%;                // shrink-fit
        text-align: right !important;
        padding-right: 0;         // remove extra padding
      }

      thead th {
        font-weight: 600;
        color: #2d2d2d;
      }

      tbody td:first-child {
        text-align: left;

        .cell-content {
          display: inline-flex;
          align-items: center;
          gap: 8px;   // spacing between +, flag, text
        }

        .cell-content i {
          margin-right: 4px;
        }
      }

      .total {
        font-weight: 600;
        background: #f8f8f8;
      }
    }
  }
}

.flag-icon {
  width: 18px;
  height: 12px;
  margin-right: 6px;
}

.viewmore {
  font-size: 13px;
  font-weight: 500;
  color: #00796b;
  text-align: right;
}
