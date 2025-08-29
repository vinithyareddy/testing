.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  /* Title + info icon */
  .heading-sec {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .title-text {
    font-size: 16px;
    font-weight: 600;
    color: #2d2d2d;
  }

  i.fa-info-circle {
    font-size: 12px;
    color: #0071bc;
    cursor: pointer;
  }

  /* Right icons */
  .header-icons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    i {
      font-size: 16px;
      cursor: pointer;
    }
  }

  .ellipsis {
    cursor: pointer;
    font-size: 18px;
    margin-left: 12px;
    color: #0071bc;
  }

  .view {
    font-size: 18px;
    color: #0071bc;
  }

  /* Table section */
  .TableView {
    max-height: 335px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 20px;

    .table {
      width: 100%;
      table-layout: fixed;

      /* Important: don't let cell borders fight with sticky rows */
      border-collapse: separate;
      border-spacing: 0;

      th,
      td {
        /* kill any inherited borders that could double up */
        border: 0 !important;
        padding: 8px 12px;
        font-size: 13px;
        vertical-align: middle;
        white-space: nowrap;
        background-clip: padding-box; /* avoids faint seams on sticky rows */
      }

      /* Zebra rows (kept) */
      tbody tr:nth-of-type(odd)  { background-color: #fff;    }
      tbody tr:nth-of-type(even) { background-color: #f4f6f9; }
      tbody tr:hover             { background-color: #eef5ff; }

      th:first-child,
      td:first-child {
        width: calc(100% - 100px);
        text-align: left;
        padding-left: 12px;
      }

      th:last-child,
      td:last-child {
        width: 100px;
        text-align: right;
        padding-right: 20px;
      }

      /* Sticky header with its own bottom hairline */
      thead tr {
        position: sticky;
        top: 0;
        z-index: 3;
        background: #f4f6f9;
      }
      thead tr::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: #d9dde3;     /* header underline */
      }
      thead th {
        font-weight: 600;
        color: #2d2d2d;
      }

      /* Draw one full-width rule per body row (fixes the left-corner gaps) */
      tbody tr {
        position: relative;
      }
      tbody tr::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: #d9dde3;     /* row separator */
      }
      /* no extra rule under the last data row (the total gets its own) */
      tbody tr:last-of-type::after { display: none; }

      /* icon spacing/color */
      tbody .cell-content i {
        margin-right: 10px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #0071bc;
      }

      .fte-col {
        width: 100px;
        text-align: right !important;
        padding-right: 20px;
      }

      /* Sticky total with a top hairline only (prevents the extra bottom line) */
      tfoot tr.total {
        position: sticky;
        bottom: 0;
        z-index: 3;
        font-weight: 600;
        background: #f4f6f9;
        color: #2d2d2d;
      }
      tfoot tr.total::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 1px;
        background: #d9dde3;     /* top border for total row */
      }
      tfoot tr.total::after { display: none; } /* make sure no bottom rule */
      tfoot tr.total td:first-child { padding-left: 8px; }
      tfoot tr.total td:last-child  { text-align: right; padding-right: 20px; }
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
    color: #0071bc;
    text-align: right;
  }
}
