.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
  padding: 15px;
  color: #fff;
  position: relative;
}

.globe-container {
  width: 70%;
  height: 800px;
  aspect-ratio: 1 / 1;
}

.zoom-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: row;

  button {
    background: #fff;
    border: 1px solid #ccc;
    padding: 5px 10px;
    margin: 2px 0;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    color: #214bcc;
    width: 40px;
    height: 40px;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}

.legend-container {
  display: flex;
  flex-direction: column;
  margin-top: 120px;
  margin-right: 20px;
  width: 25%;
}

.legend-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  color: #fff; // default: Region view
}

.legend-wrapper {
  &.scrollable {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    background: #fff;

    .legend-table thead {
      position: sticky;
      top: 0;
      background: #f8f9fa;
      z-index: 1;
    }
  }
}

/* Override title color in Country view (scrollable legend) */
.legend-wrapper.scrollable ~ .legend-title,
.legend-container .legend-wrapper.scrollable ~ .legend-title {
  color: #000;
}

.legend-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.9rem;
  color: #000;
  border-radius: 0;
}

.legend-table th,
.legend-table td {
  padding: 10px;
}

.legend-table th:first-child {
  text-align: left !important;
  padding-left: 30px !important;
}

.legend-table th.left {
  text-align: left;
}

.legend-table th.right {
  text-align: right;
}

.legend-table td.cost-col {
  text-align: right;
}

.legend-table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-icon {
  font-size: 1rem;
  color: #2083c4;
}

.flag-icon {
  width: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

.ellipsis {
  cursor: pointer;
  font-size: 18px;
  margin-left: 12px;
  color: #0071bc;
  margin-top: 1px;
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;

  i {
    font-size: 16px;
    cursor: pointer;
  }

  .fa-expand {
    margin-top: 7px;
  }
}

.custom-dropdown {
  .btn {
    padding: 2px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    width: 200px;
  }

  .dropdown-menu {
    font-size: 14px;
    min-width: 140px;
    z-index: 2000 !important;
    display: block !important;
    position: absolute;
    margin-top: 4px;
  }

  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    i {
      color: #007bff;
    }
  }
}

:host ::ng-deep .tooltip-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  width: 160px;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background: #fff;
  margin-left: 20px;

  .tooltip-row {
    padding: 6px 10px;
  }

  .tooltip-header {
    background: #f4f6f9;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #000 !important;
  }

  .tooltip-body {
    background: #fff;
    color: #000;
    display: flex;
    justify-content: space-between;
  }

  img {
    width: 20px;
    height: 14px;
    border: 1px solid #ccc;
  }
}
