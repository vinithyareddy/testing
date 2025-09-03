/* Box container */
.box-md {
  background: #e8f1f5;                  /* soft blue background */
  border: 1px solid #cfe0e8;            /* subtle border */
  border-radius: 8px;                   /* smooth corners */
  padding: 14px 16px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
  transition: box-shadow 0.2s ease-in;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

/* Titles (like WFFA BUDGET UTILIZATION, TOTAL WFFA BUDGET) */
.budget-box-h1 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #294b5a;
}

/* Values (big numbers) */
.budget-box-h2 {
  font-size: 24px;
  font-weight: 700;
  color: #143846;
  line-height: 1.2;
}

/* Progress bar (for Utilization card) */
.progress {
  background: #d7e7ee;
  border-radius: 6px;
  height: 8px;
  overflow: hidden;

  .progress-bar {
    background: #2d8cdf;               /* blue fill */
  }
}

/* Small labels under bar */
.small {
  font-size: 11px;
  color: #476e7f;
}

/* Card icon on right corner */
.imgvi {
  width: 18px;
  height: 18px;
  opacity: 0.85;
  margin-top: 4px;
}


<div class="row mt-1 text-center">
  <!-- Card 1 -->
  <div class="col-md-2 col flex-fill">
    <div class="box-md">
      <div class="row">
        <div class="col-10">
          <div class="budget-box-h1">WFFA BUDGET UTILIZATION</div>
          <div class="budget-box-h2 mt-1">$2M</div>
          <div class="progress mt-2">
            <div class="progress-bar" style="width:60%"></div>
          </div>
          <div class="d-flex justify-content-between small mt-1">
            <span>Labor Cost $1.2M</span>
            <span>Total Budget $2M</span>
          </div>
        </div>
        <div class="col-2 text-end">
          <img src="../../assets/images/card_icon.png" class="imgvi" />
        </div>
      </div>
    </div>
  </div>

  <!-- Card 2 -->
  <div class="col-md-2 col flex-fill">
    <div class="box-md">
      <div class="row">
        <div class="col-10">
          <div class="budget-box-h1">TOTAL WFFA BUDGET</div>
          <div class="budget-box-h2 mt-1">$2M</div>
        </div>
        <div class="col-2 text-end">
          <img src="../../assets/images/card_icon.png" class="imgvi" />
        </div>
      </div>
    </div>
  </div>

  <!-- Card 3 -->
  <div class="col-md-2 col flex-fill">
    <div class="box-md">
      <div class="row">
        <div class="col-10">
          <div class="budget-box-h1">TOTAL EMPLOYEES</div>
          <div class="budget-box-h2 mt-1">10</div>
        </div>
        <div class="col-2 text-end">
          <img src="../../assets/images/card_icon.png" class="imgvi" />
        </div>
      </div>
    </div>
  </div>

  <!-- Card 4 -->
  <div class="col-md-2 col flex-fill">
    <div class="box-md">
      <div class="row">
        <div class="col-10">
          <div class="budget-box-h1">TOTAL LABOR COSTS</div>
          <div class="budget-box-h2 mt-1">$1.2M</div>
        </div>
        <div class="col-2 text-end">
          <img src="../../assets/images/card_icon.png" class="imgvi" />
        </div>
      </div>
    </div>
  </div>

  <!-- Card 5 -->
  <div class="col-md-2 col flex-fill">
    <div class="box-md">
      <div class="row">
        <div class="col-10">
          <div class="budget-box-h1">AVERAGE LABOR COSTS</div>
          <div class="budget-box-h2 mt-1">$120K</div>
        </div>
        <div class="col-2 text-end">
          <img src="../../assets/images/card_icon.png" class="imgvi" />
        </div>
      </div>
    </div>
  </div>
</div>
