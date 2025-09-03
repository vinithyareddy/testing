<div class="widgets-row">
  <!-- Utilization -->
  <div class="widget-card">
    <img src="assets/images/money_bag.svg" class="icon" alt="">
    <div class="title">WFFA Budget Utilization</div>
    <div class="value-row with-percent">
      <div class="value">$2M</div>
      <div class="percent">60%</div>
    </div>
    <div class="bar"><div class="fill" style="width:60%"></div></div>
    <div class="bar-labels">
      <span>Labor Cost <strong>$1.2M</strong></span>
      <span class="right">Total Budget <strong>$2M</strong></span>
    </div>
  </div>

  <!-- Simple cards -->
  <div class="widget-card">
    <img src="assets/images/money_bag.svg" class="icon" alt="">
    <div class="title">Total WFFA Budget</div>
    <div class="value">$2M</div>
  </div>

  <div class="widget-card">
    <img src="assets/images/users.svg" class="icon" alt="">
    <div class="title">Total Employees</div>
    <div class="value">10</div>
  </div>

  <div class="widget-card">
    <img src="assets/images/money_bag.svg" class="icon" alt="">
    <div class="title">Total Labor Costs</div>
    <div class="value">$1.2M</div>
  </div>

  <div class="widget-card">
    <img src="assets/images/money_bag.svg" class="icon" alt="">
    <div class="title">Average Labor Costs</div>
    <div class="value">$120K</div>
  </div>
</div>


/* ONE ROW: 5 tiles across; scrolls horizontally on smaller screens */
.widgets-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(240px, 1fr)); /* always 5 columns */
  gap: 14px;
  overflow-x: auto;            /* allow scroll if viewport is too narrow */
  padding-bottom: 6px;         /* room for scrollbar */
}

/* Card look */
.widget-card {
  position: relative;
  background: #e8f1f5;
  border: 1px solid #cfe0e8;
  border-radius: 10px;
  padding: 14px 14px 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  min-height: 106px;
}

.icon {
  position: absolute;
  right: 10px; top: 10px;
  width: 18px; height: 18px; opacity: .85;
}

.title {
  font-size: 12px; font-weight: 700; letter-spacing: .3px;
  color: #294b5a; text-transform: uppercase;
}

.value-row {
  margin-top: 6px; display: flex; align-items: baseline; justify-content: space-between;
}
.value { font-size: 28px; line-height: 1.1; font-weight: 700; color: #143846; }
.percent { font-size: 16px; font-weight: 600; color: #476e7f; }

.bar {
  margin-top: 10px; height: 10px; background: #d7e7ee; border-radius: 6px; overflow: hidden;
  .fill { height: 100%; background: #2d8cdf; border-radius: 6px 0 0 6px; }
}
.bar-labels {
  margin-top: 6px; font-size: 12px; color: #476e7f;
  display: flex; justify-content: space-between;
}
