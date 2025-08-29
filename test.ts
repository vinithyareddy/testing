.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
  margin-top: 25px;

  /* Title + info icon */
  .heading-sec {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .title-text { font-size: 16px; font-weight: 600; color: #2d2d2d; }
  i.fa-info-circle { font-size: 12px; color: #0071bc; cursor: pointer; }

  /* Right icons */
  .header-icons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    i { font-size: 16px; cursor: pointer; }
  }

  .ellipsis { cursor: pointer; font-size: 18px; margin-left: 12px; color: #0071bc; }
  .view     { font-size: 18px; color: #0071bc; }

  /* Table section */
  .TableView {
    max-height: 335px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 20px;

    /* 🔑 Add a border on the SCROLL CONTAINER so edges are continuous
       even when header/footer are sticky. */
    border: 1px solid #e0e0e0;
    border-radius: 6px;

    .table {
      width: 100%;
      /* 🔑 Use separate model to avoid border-collapsing glitches with sticky rows */
      border-collapse: separate;
      border-spacing: 0;
      table-layout: fixed;

      th, td {
        padding: 8px 12px;
        font-size: 13px;
        vertical-align: middle;
        white-space: nowrap;
      }

      /* ✅ Alternating row colors */
      tbody tr:nth-of-type(odd)  { background-color: #fff; }
      tbody tr:nth-of-type(even) { background-color: #f4f6f9; }
      tbody tr:hover { background-color: #eef5ff; }

      th:first-child, td:first-child {
        width: calc(100% - 100px);
        text-align: left;
        padding-left: 12px;
      }
      th:last-child, td:last-child {
        width: 100px;
        text-align: right;
        padding-right: 20px;
      }

      /* 🔑 Sticky header + footer */
      thead th {
        font-weight: 600;
        color: #2d2d2d;
        background-color: #f4f6f9;
        position: sticky;
        top: 0;
        z-index: 2;
      }

      /* 🔑 Draw the missing vertical line INSIDE the sticky cells,
         so the left edge looks continuous. */
      thead th:first-child { box-shadow: inset 1px 0 0 #e0e0e0; border-top-left-radius: 6px; }
      thead th:last-child  { border-top-right-radius: 6px; }

      tbody .cell-content i {
        margin-right: 10px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #0071bc;
      }

      .fte-col { width: 100px; text-align: right !important; padding-right: 20px; }

      /* ✅ Total row always visible at bottom */
      tfoot tr.total {
        font-weight: 600;
        background: #f4f6f9;
        color: #2d2d2d;
        position: sticky;
        bottom: 0;
        z-index: 2;
      }

      /* 🔑 Same trick for footer left edge + rounded corners */
      tfoot tr.total td:first-child { box-shadow: inset 1px 0 0 #e0e0e0; border-bottom-left-radius: 6px; }
      tfoot tr.total td:last-child  { border-bottom-right-radius: 6px; }
    }
  }

  .flag-icon { width: 18px; height: 12px; margin-right: 6px; }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #0071bc;
    text-align: right;
  }
}
