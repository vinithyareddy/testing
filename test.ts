<div class="kpi-row">
  <!-- Utilization -->
  <div class="kpi-card">
    <div class="kpi-title">WFFA Budget Utilization</div>
    <div class="kpi-value">$2M <span class="kpi-percent">60%</span></div>
    <div class="kpi-bar">
      <div class="fill" style="width:60%"></div>
    </div>
    <div class="kpi-meta">
      <span>Labor Cost $1.2M</span>
      <span>Total Budget $2M</span>
    </div>
  </div>

  <div class="kpi-card">
    <div class="kpi-title">Total WFFA Budget</div>
    <div class="kpi-value">$2M</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-title">Total Employees</div>
    <div class="kpi-value">10</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-title">Total Labor Costs</div>
    <div class="kpi-value">$1.2M</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-title">Average Labor Costs</div>
    <div class="kpi-value">$120K</div>
  </div>
</div>


.kpi-row {
  display: flex;
  gap: 12px;
}

.kpi-card {
  flex: 1; /* all 5 take equal space */
  background: #e8f1f5;
  border: 1px solid #cfe0e8;
  border-radius: 8px;
  padding: 12px;
  min-height: 100px;
}

.kpi-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #294b5a;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #143846;
  margin-top: 6px;
}

.kpi-percent {
  font-size: 14px;
  font-weight: 600;
  color: #476e7f;
  margin-left: 8px;
}

.kpi-bar {
  margin-top: 8px;
  height: 8px;
  background: #d7e7ee;
  border-radius: 4px;
  overflow: hidden;
}
.kpi-bar .fill {
  height: 100%;
  background: #2d8cdf;
}

.kpi-meta {
  margin-top: 6px;
  font-size: 11px;
  color: #476e7f;
  display: flex;
  justify-content: space-between;
}
