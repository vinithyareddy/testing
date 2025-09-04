<!-- Chart -->
<div class="content-area">
  <button class="nav-arrow left-arrow"><i class="fa fa-chevron-left"></i></button>

  <highcharts-chart
    [Highcharts]="Highcharts"
    [options]="chartOptions"
    style="width: 100%; height: 290px; display: block;">
  </highcharts-chart>

  <button class="nav-arrow right-arrow"><i class="fa fa-chevron-right"></i></button>
</div>

<div class="viewmore pointer mt-3 pt-3">
  <span>View More&nbsp;&nbsp;</span>
  <i class="fa fa-angle-right"></i>
</div>



.content-area {
  position: relative;
  border: 1px solid #ccd5df;
  border-radius: 8px;
  padding-bottom: 20px;
  background: #fff;
}

/* shared arrow styles */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #ccd5df;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0071bc;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  i {
    font-size: 14px;
  }
}

/* left/right placement */
.left-arrow {
  left: -12px;   // stick just outside chart border
}

.right-arrow {
  right: -12px;
}
