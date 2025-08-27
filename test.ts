/* top space to match the second picture */
.budget-card-box { margin-top: 14px; }

/* keep chart box tidy */
.inner-card-box highcharts-chart {
  display: block;
  width: 100%;
  height: 240px;
}

/* blue & small info icon like the screenshot */
.info-blue {
  margin-left: 6px;
  i { color: #2563eb; font-size: 14px; }
}

/* optional: a subtle card-like border on chart area */
.inner-card-box {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 4px 2px 0 2px;
}

/* toggle buttons (selected state) if you need visuals like your sample */
.togglebtn {
  display: inline-flex; gap: 6px;
  .lft-toggle, .rgt-toggle {
    border: 1px solid #cbd5e1;
    background: #f8fafb;
    width: 28px; height: 28px; border-radius: 6px;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
    .fnticon { color: #64748b; font-size: 14px; }
  }
  .lft-toggle-active, .rgt-toggle-active {
    border-color: #2f67d2; background: #eef5ff;
    .fnticon { color: #2f67d2; }
  }
}
