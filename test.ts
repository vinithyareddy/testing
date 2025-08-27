/* swfp-by-fcv-status.component.scss */
$fcv: #0b6f6a;
$nonfcv: #78c9c5;
$border: #e7e7e7;

.card {
  margin-top: 14px;           /* (1) top margin */
  background: #fff;
  border: 1px solid $border;
  border-radius: 12px;
  padding: 10px 12px 6px;
  width: 340px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

.card-header { margin-bottom: 6px; }

.title-row {
  display: flex; align-items: center; justify-content: space-between;
}

.title {
  font-size: 18px; font-weight: 600; line-height: 1.25; color: #1a1a1a;
  .info {
    margin-left: 6px;
    .i { width: 16px; height: 16px; vertical-align: -2px; }
    .i circle, .i rect { fill: #2563eb; }     /* (4) blue info icon, small */
  }
}

.toolbar {
  display: flex; gap: 6px;
  .btn {
    width: 28px; height: 28px;
    border-radius: 6px;
    display: inline-flex; align-items: center; justify-content: center;
    background: #f8fafb;
    border: 1px solid #cbd5e1;
    padding: 0;
    svg { width: 16px; height: 16px; fill: #64748b; }
  }
  .btn-selected {
    background: #eef5ff;
    border: 1px solid #2f67d2;
    svg { fill: #2f67d2; }
  }
}

.chart-wrap {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 2px 2px 0 2px;
  margin: 6px 0 6px;
}

/* legend + view more same as before */
.legend {
  display: flex; gap: 16px; align-items: center;
  font-size: 14px; color: #2f2f2f; padding: 2px 6px 8px;
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin: 0 6px 0 10px; }
  .dot-fcv { background: $fcv; }
  .dot-non { background: $nonfcv; }
}

.view-more {
  display: flex; justify-content: flex-end; align-items: center;
  font-size: 14px; color: #2563eb; cursor: pointer; padding-right: 4px;
  .arrow { font-size: 18px; margin-left: 4px; }
}
