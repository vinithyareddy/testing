<!-- swfp-by-fcv-status.component.html -->
<div class="card">
  <div class="card-header">
    <div class="title-row">
      <div class="title">
        {{ widgetTitle }}
        <span class="info" title="Counts of FCV vs Non-FCV in FTE">
          <!-- small blue info icon -->
          <svg viewBox="0 0 24 24" class="i">
            <circle cx="12" cy="12" r="10" />
            <rect x="11" y="10" width="2" height="7" rx="1" />
            <rect x="11" y="6" width="2" height="2" rx="1" />
          </svg>
        </span>
      </div>

      <div class="toolbar">
        <!-- bar icon (unselected) -->
        <button class="btn btn-light" aria-label="Bar view">
          <svg viewBox="0 0 24 24"><rect x="5" y="10" width="3" height="9"/><rect x="10.5" y="6" width="3" height="13"/><rect x="16" y="12" width="3" height="7"/></svg>
        </button>

        <!-- pie icon (selected) -->
        <button class="btn btn-selected" aria-label="Donut view">
          <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10h-8a2 2 0 0 1-2-2z"/></svg>
        </button>

        <!-- kebab -->
        <button class="btn btn-light" aria-label="More">
          <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div class="chart-wrap">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 240px; display: block"
    ></highcharts-chart>
  </div>

  <div class="legend">
    <span class="dot dot-fcv"></span> FCV
    <span class="dot dot-non"></span> Non - FCV
  </div>

  <div class="view-more">View More <span class="arrow">›</span></div>
</div>
