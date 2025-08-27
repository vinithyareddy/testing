/* swfp-by-fcv-status.component.scss */
.budget-card-box { 
  margin-top: 14px;          /* (1) top margin like screenshot */
}
/* Header toolbar buttons */
.toolbar {
  display: flex; gap: 6px; justify-content: flex-end;
}
.toolbar .btn {
  width: 28px; height: 28px; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 6px;
  background: #f8fafb;         /* light */
  border: 1px solid #cbd5e1;    /* grey border */
}
.toolbar .btn svg { width: 16px; height: 16px; fill: #64748b; }
.toolbar .btn-selected {
  background: #eef5ff;          /* blue tint */
  border: 1px solid #2f67d2;
}
.toolbar .btn-selected svg { fill: #2f67d2; }
/* (3) small blue info icon next to title */
.widget-heading .fa-info-circle {
  color: #2563eb;       /* blue */
  font-size: 13px;      /* smaller */
  vertical-align: text-top;  /* aligns like screenshot */
  margin-left: 6px;
}




<!-- NEW toolbar (bar icon, selected pie icon, kebab) -->
<div class="toolbar">
  <!-- bar icon (unselected) -->
  <button class="btn btn-light" aria-label="Bar view" (click)="loadWidget('th')">
    <svg viewBox="0 0 24 24"><rect x="5" y="10" width="3" height="9"/><rect x="10.5" y="6" width="3" height="13"/><rect x="16" y="12" width="3" height="7"/></svg>
  </button>

  <!-- pie icon (selected) -->
  <button class="btn btn-selected" aria-label="Donut view" (click)="loadWidget('ch')">
    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10h-8a2 2 0 0 1-2-2z"/></svg>
  </button>

  <!-- kebab (three dots) -->
  <button class="btn btn-light" aria-label="More">
    <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
  </button>
</div>
