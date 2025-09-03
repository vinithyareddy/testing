<div class="row mt-1">
  <!-- 1) Utilization card -->
  <div class="col">
    <div class="box-md">
      <div class="d-flex justify-content-between align-items-center">
        <div class="budget-box-h1">WFFA Budget Utilization</div>
        <img src="assets/images/money_bag.svg" class="imgvi" alt="">
      </div>

      <div class="d-flex justify-content-between align-items-baseline mt-1">
        <div class="budget-box-h2">$2M</div>
        <div class="percent">60%</div>
      </div>

      <div class="progress mt-2">
        <div class="progress-bar" style="width:60%"></div>
      </div>

      <div class="d-flex justify-content-between small mt-1">
        <span>Labor Cost <strong>$1.2M</strong></span>
        <span>Total Budget <strong>$2M</strong></span>
      </div>
    </div>
  </div>

  <!-- 2) Total WFFA Budget -->
  <div class="col">
    <div class="box-md">
      <div class="d-flex justify-content-between align-items-center">
        <div class="budget-box-h1">Total WFFA Budget</div>
        <img src="assets/images/money_bag.svg" class="imgvi" alt="">
      </div>
      <div class="budget-box-h2 mt-1">$2M</div>
    </div>
  </div>

  <!-- 3) Total Employees -->
  <div class="col">
    <div class="box-md">
      <div class="d-flex justify-content-between align-items-center">
        <div class="budget-box-h1">Total Employees</div>
        <img src="assets/images/users.svg" class="imgvi" alt="">
      </div>
      <div class="budget-box-h2 mt-1">10</div>
    </div>
  </div>

  <!-- 4) Total Labor Costs -->
  <div class="col">
    <div class="box-md">
      <div class="d-flex justify-content-between align-items-center">
        <div class="budget-box-h1">Total Labor Costs</div>
        <img src="assets/images/money_bag.svg" class="imgvi" alt="">
      </div>
      <div class="budget-box-h2 mt-1">$1.2M</div>
    </div>
  </div>

  <!-- 5) Average Labor Costs -->
  <div class="col">
    <div class="box-md">
      <div class="d-flex justify-content-between align-items-center">
        <div class="budget-box-h1">Average Labor Costs</div>
        <img src="assets/images/money_bag.svg" class="imgvi" alt="">
      </div>
      <div class="budget-box-h2 mt-1">$120K</div>
    </div>
  </div>
</div>


/* card box */
.box-md {
  background: #e8f1f5;
  border: 1px solid #cfe0e8;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  min-height: 110px;
}

/* title */
.budget-box-h1 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #294b5a;
}

/* big value */
.budget-box-h2 {
  font-size: 26px;
  font-weight: 700;
  color: #143846;
  line-height: 1.2;
}

/* percent on utilization */
.percent {
  font-size: 16px;
  font-weight: 600;
  color: #476e7f;
}

/* bar for utilization */
.progress {
  background: #d7e7ee;
  border-radius: 6px;
  height: 10px;
  overflow: hidden;
}
.progress-bar {
  background: #2d8cdf;
  height: 100%;
}

/* small labels under bar */
.small {
  font-size: 12px;
  color: #476e7f;

  strong {
    font-weight: 700;
    color: #143846; /* makes 1.2M / 2M bold */
  }
}

/* card icons */
.imgvi {
  width: 18px;
  height: 18px;
  opacity: .85;
}
