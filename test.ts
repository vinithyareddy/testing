<!-- ======= SUPPORT SECTION ======= -->
<div class="container-fluid support-section">
  <div class="container-lg">
    <div class="row align-items-center">

      <!-- Left Text Block -->
      <div class="col-md-7">
        <div class="support-left">
          <div class="support-title">Support for your everyday need</div>
          <div class="support-subtext">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet ligula quis diam gravida.
          </div>
        </div>
      </div>

      <!-- Right Cards -->
      <div class="col-md-5">
        <div class="support-right">

          <div class="support-card">
            <div class="card-title">IT HELP DESK</div>
            <div class="card-desc">
              <a href="mailto:itsdasupport@worldbank.org">itsdasupport@worldbank.org</a><br />
              <span class="card-note">(Ops Portal and Standard Reports-related questions)</span>
            </div>
          </div>

          <div class="support-card dark">
            <div class="card-title">Integration with Data Studio & Data Explorer</div>
            <div class="card-desc">
              OneWB Reports dashboards in Data Studio with a Pro Power BI license.<br /><br />
              <span class="card-link">Request License</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ======= THREE SMALL BLOCKS BELOW ======= -->
    <div class="row support-bottom">
      <div class="col-md-4">
        <div class="small-box">
          <div class="small-head">User Guide</div>
          <div class="small-desc">WPA Module Standard Reports User Guide</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="small-box">
          <div class="small-head">Published Announcement</div>
          <div class="small-desc">
            Sponsor: BPS Solutions (BPSSO)<br />
            Date: April 28, 2025
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="small-box">
          <div class="small-head">Glossary</div>
          <div class="small-desc">
            A platform to govern business terms, definitions, key management reports, and data assets.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- ======= END SUPPORT SECTION ======= -->



/* ================================
   SUPPORT SECTION
================================= */
.support-section {
  background: linear-gradient(90deg, #1c1b3a 0%, #2a246b 100%);
  color: white;
  padding: 60px 0;
  border-radius: 8px;
  margin-top: 40px;
  position: relative;
}

.support-left {
  padding: 20px 0;
}

.support-title {
  font-size: 30px;
  font-weight: 600;
  color: #fff;
}

.support-subtext {
  font-size: 16px;
  color: #d3d2f3;
  margin-top: 15px;
  max-width: 80%;
  line-height: 1.6;
}

/* Right Cards */
.support-right {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.support-card {
  background: #ffffff;
  color: #000;
  border-radius: 8px;
  padding: 18px 20px;
  font-size: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.support-card.dark {
  background: #2f2256;
  color: #fff;
}

.support-card.dark .card-link {
  color: #a3c8ff;
  font-weight: 500;
  cursor: pointer;
}

.support-card .card-title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 5px;
}

.support-card .card-desc {
  font-size: 13px;
  line-height: 1.5;
}

.support-card .card-desc a {
  color: #0071bc;
  font-weight: 500;
  text-decoration: none;
}

/* Bottom Boxes */
.support-bottom {
  margin-top: 40px;
}

.small-box {
  background: #f6f6f6;
  border-radius: 6px;
  padding: 18px 20px;
  height: 100%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: 0.3s ease;
}

.small-box:hover {
  transform: translateY(-3px);
  background: #ffffff;
}

.small-head {
  font-size: 15px;
  font-weight: 600;
  color: #3a3a3a;
  margin-bottom: 8px;
}

.small-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
