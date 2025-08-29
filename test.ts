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

    /* ⬇️ Only scroll container — no border here to avoid the “double frame” */
    /* border: none; padding: 0; */

    .table {
      width: 100%;

      /* ⬇️ Key changes to fix the broken corners */
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #dcdfe6;      /* single clean frame */
      border-radius: 6px;              /* rounded outer corners */
      background: #fff;                /* keeps the frame solid under stripes */

      th,
      td {
        padding: 8px 12px;
        font-size: 13px;
        vertical-align: middle;
        white-space: nowrap;
      }

      /* horizontal separators only */
      thead th { border-bottom: 1px solid #e6e6e6; }
      tbody td { border-bottom: 1px solid #e6e6e6; }
      /* avoid double line before total row */
      tbody tr:last-child td { border-bottom: none; }
      /* soft divider above sticky total */
      tfoot td { border-top: 1px solid #e6e6e6; }

      /* zebra */
      tbody tr:nth-of-type(odd) { background-color: #fff; }
      tbody tr:nth-of-type(even) { background-color: #f4f6f9; }
      tbody tr:hover { background-color: #eef5ff; }

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

      thead th {
        font-weight: 600;
        color: #2d2d2d;
        background-color: #f4f6f9;
        position: sticky;
        top: 0;
        z-index: 2; /* stays above rows while scrolling */
      }

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

      /* sticky total row at the very bottom */
      tfoot tr.total {
        font-weight: 600;
        background: #f4f6f9;
        color: #2d2d2d;
        position: sticky;
        bottom: 0;
        z-index: 2;

        td:first-child { padding-left: 8px; }
        td:last-child  { text-align: right; padding-right: 20px; }
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
    color: #0071bc;
    text-align: right;
  }
}
