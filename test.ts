<div class="kpi-row">
  <!-- 1) Utilization card -->
  <section class="kpi-card kpi--util">
    <div class="kpi-head">
      <h6 class="kpi-title">
        <img class="kpi-icon" src="assets/images/money_bag.svg" alt="">
        WFFA Budget Utilization
      </h6>
    </div>

    <div class="kpi-main">
      <div class="kpi-value">$2M</div>
      <div class="kpi-percent">60%</div>
    </div>

    <div class="kpi-bar">
      <span class="kpi-bar-fill" style="width:60%"></span>
    </div>

    <div class="kpi-meta">
      <span>Labor Cost <strong>$1.2M</strong></span>
      <span>Total Budget <strong>$2M</strong></span>
    </div>
  </section>

  <!-- 2) Simple KPI -->
  <section class="kpi-card">
    <div class="kpi-head">
      <h6 class="kpi-title">
        <img class="kpi-icon" src="assets/images/money_bag.svg" alt="">
        Total WFFA Budget
      </h6>
    </div>
    <div class="kpi-value">$2M</div>
  </section>

  <!-- 3) Simple KPI -->
  <section class="kpi-card">
    <div class="kpi-head">
      <h6 class="kpi-title">
        <img class="kpi-icon" src="assets/images/users.svg" alt="">
        Total Employees
      </h6>
    </div>
    <div class="kpi-value">10</div>
  </section>

  <!-- 4) Simple KPI -->
  <section class="kpi-card">
    <div class="kpi-head">
      <h6 class="kpi-title">
        <img class="kpi-icon" src="assets/images/money_bag.svg" alt="">
        Total Labor Costs
      </h6>
    </div>
    <div class="kpi-value">$1.2M</div>
  </section>

  <!-- 5) Simple KPI -->
  <section class="kpi-card">
    <div class="kpi-head">
      <h6 class="kpi-title">
        <img class="kpi-icon" src="assets/images/money_bag.svg" alt="">
        Average Labor Costs
      </h6>
    </div>
    <div class="kpi-value">$120K</div>
  </section>
</div>


.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  align-items: stretch;
}

.kpi-card {
  background: #e8f1f5;
  border: 1px solid #cfe0e8;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kpi-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
}

.kpi-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #294b5a;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.kpi-icon {
  width: 16px;
  height: 16px;
  opacity: .85;
}

.kpi-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  color: #143846;
  line-height: 1.1;
}

.kpi-main {
  margin-top: 6px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.kpi-percent {
  font-size: 16px;
  font-weight: 600;
  color: #476e7f;
}

/* utilization only */
.kpi--util .kpi-bar {
  margin-top: 10px;
  height: 10px;
  background: #d7e7ee;
  border-radius: 6px;
  overflow: hidden;
}

.kpi--util .kpi-bar-fill {
  display: block;
  height: 100%;
  background: #2d8cdf;
  border-radius: 6px 0 0 6px;
}

.kpi--util .kpi-meta {
  margin-top: 6px;
  font-size: 12px;
  color: #476e7f;
  display: flex;
  justify-content: space-between;

  strong {
    font-weight: 700; /* makes 1.2M and 2M bold */
    color: #143846;
  }
}
