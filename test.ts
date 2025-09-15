.globe-tooltip {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  max-width: 250px;
  pointer-events: none;
  overflow: hidden;
  padding: 0;

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f3f4f6;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;

    .flag-icon {
      width: 20px;
      height: auto;
      border-radius: 2px;
    }
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 0;
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;

    .label {
      font-size: 13px;
      color: #374151;
    }

    .value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
  }
}
