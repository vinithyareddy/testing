.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  /* ───────── Heading (title + info icon) ───────── */
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

  /* ───────── Right header icons ───────── */
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

  /* ───────── Table with scroll (outer frame lives on scroller) ───────── */
  .TableView {
    max-height: 335px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 20px;

    /* Solid outer frame that won't shift while scrolling */
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    background: #fff;

    .table {
      width: 100%;
      table-layout: fixed;

      /* IMPORTANT: don't let the table draw its own outer border */
      border-collapse: separate;
      border-spacing: 0;

      th,
      td {
        padding: 8px 12px;
        font-size: 13px;
        vertical-align: middle;
        white-space: nowrap;
      }

      /* Alternating rows + hover */
      tbody tr:nth-of-type(odd)  { background-color: #fff; }
      tbody tr:nth-of-type(even) { background-color: #f4f6f9; }
      tbody tr:hover             { background-color: #eef5ff; }

      /* Only horizontal separators inside, no extra outer borders */
      tbody td {
        border-bottom: 1px solid #e6e6e6;
      }
      tbody tr:last-child td { border-bottom: none; }

      /* Sticky header */
      thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: #f4f6f9;
        font-weight: 600;
        color: #2d2d2d;
        border-bottom: 1px solid #e6e6e6;
      }

      /* Sticky total row at bottom */
      tfoot tr.total {
        position: sticky;
        bottom: 0;
        z-index: 1;
        background: #f4f6f9;
        color: #2d2d2d;
        font-weight: 600;
      }
      tfoot tr.total td {
        border-top: 1px solid #e6e6e6;
      }

      /* Column sizing */
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

      .fte-col {
        width: 100px;
        text-align: right !important;
        padding-right: 20px;
      }

      /* Icons in first column */
      tbody .cell-content i {
        margin-right: 10px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #0071bc;
      }
    }
  }

  /* Misc */
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
