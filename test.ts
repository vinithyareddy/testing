.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  .ellipsis {
    cursor: pointer;
    font-size: 18px;   // bigger icon size
    margin-left: 12px; // space between expand and ellipsis
  }

  .view {
    font-size: 18px;   // bigger fullscreen icon
  }

  .budget-box-chart {
    .bgt-text-end {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;        // ensures consistent spacing
    }
  }

  .TableView {
    max-height: 300px;   // keeps table smaller
    overflow-y: auto;    // enables vertical scroll
    overflow-x: hidden;  // no horizontal scroll
    margin-bottom: 20px; // gap before "View More"

    .table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;

      th,
      td {
        padding: 8px 12px;
        font-size: 13px;
        vertical-align: middle;
        white-space: nowrap;
      }

      // ✅ Alternate row background colors
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      tbody tr:nth-child(odd) {
        background-color: #ffffff;
      }

      tbody tr:hover {
        background-color: #eef5ff;
      }

      th:first-child,
      td:first-child {
        width: calc(100% - 100px); // everything except FTE col
        text-align: left;
        padding-left: 12px;
      }

      th:last-child,
      td:last-child {
        width: 100px;              // fixed FTE column
        text-align: right;
        padding-right: 20px;
      }

      thead {
        th {
          font-weight: 600;
          color: #2d2d2d;
          background-color: #f4f6f9;
          position: sticky;   // ✅ header sticks
          top: 0;
          z-index: 2;
        }
      }

      tbody {
        .cell-content i {
          margin-right: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0071bc;
        }
      }

      .fte-col {
        width: 100px;
        text-align: right !important;
        padding-right: 20px;
      }

      // ✅ Total row always visible at bottom
      tfoot {
        tr.total {
          font-weight: 600;
          background: #f0f0f0 !important;
          position: sticky;
          bottom: 0;
          z-index: 2;

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
}
