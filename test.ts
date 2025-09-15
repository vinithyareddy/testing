.legend-wrapper {
  margin-top: 120px;
  margin-right: 20px;
  width: 25%;
  display: flex;
  flex-direction: column;

  &.scrollable {
    .legend-table {
      display: block;
      max-height: 500px;       // ✅ Limit height
      overflow-y: auto;        // ✅ Make scrollable
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      background: #fff;

      thead {
        position: sticky;
        top: 0;
        background: #f8f9fa;
        z-index: 1;
        display: table-header-group;
      }

      tbody {
        display: block;        // ✅ Allow tbody scrolling
      }

      tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
    }
  }
}

/* ✅ Legend row click feedback */
.legend-table tr {
  cursor: pointer;             // makes it feel clickable
  transition: background 0.2s ease;

  &:hover {
    background-color: #f1f5f9; // light hover highlight
  }
}
