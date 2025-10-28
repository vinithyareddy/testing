.top-mini-header {
  background-color: #0D3EA1;
  color: #fff;
  font-weight: 500;
  width: 100% !important;
  padding: 0 !important; // Remove any default padding
  
  .header-content-container {
      // This class handles all alignment now
  }
 
  .row {
      margin-left: 0;
      margin-right: 0;
  }
  
  .header-main-menu {
      padding-left: 0;
      margin-bottom: 0;
      
      li {
          font-family: Open Sans;
          font-weight: 600;
          font-style: SemiBold;
          font-size: 14px;
          float: left;
          padding: 3px 9px;
          line-height: 25px;
          letter-spacing: 0;
          text-align: center;
          vertical-align: middle;
          text-transform: uppercase;
          cursor: pointer;
          width: auto;
          margin-right: 25px;
          z-index: 9999;
          position: relative;
      }

      li:hover {
          background-color: #000;
      }
  }

  .right-menu {
      span {
          float: right;
          font-family: Open Sans;
          font-weight: 600;
          font-style: SemiBold;
          font-size: 14px;
          padding: 3px 9px;
          line-height: 25px;
          letter-spacing: 0;
          text-align: center;
          vertical-align: middle;
          text-transform: uppercase;
          cursor: pointer;
          width: auto;
          z-index: 9999;
          position: relative;
      }

      .rightview {
          float: inline-end;
      }

      .right-txt:hover {
          background-color: #000;
      }
  }
}

.HeaderNewBgView {
  min-height: 290px;
  background: url('assets/images//onewb/home_banner.png');
  width: 100% !important;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0 !important; // Remove any default padding
  
  .header-content-container {
      // This class handles all alignment now
  }
  
  .row {
      margin-left: 0;
      margin-right: 0;
  }

  .header-lg-fnt {
      font-feature-settings: 'clig' off, 'liga' off;
      font-family: Poppins;
      font-size: 48px;
      font-style: SemiBold;
      font-weight: 600;
      line-height: 117%;
      letter-spacing: 0%;
      padding-top: 24px;
      padding-bottom: 24px;
  }

  .sub-heder-fnt {
      font-family: Poppins;
      font-weight: 400;
      font-style: Medium;
      font-size: 18px;
      line-height: 150%;
      letter-spacing: 0%;
      padding-bottom: 24px;
  }

  .searchBox {
      margin-top: 10px;
      margin-bottom: 12px;
      padding-bottom: 24px;
  }
}

// Remove or update the old content-wrapper-section
.content-wrapper-section {
  width: 100%;
  max-width: 1920px;
  margin: 0px auto;
  padding-left: 10%;
  padding-right: 10%;
  box-sizing: border-box;
}


// Global alignment container - Add to styles.scss or global stylesheet
.header-content-container {
  width: 100%;
  max-width: 1920px; // Maximum width
  margin: 0 auto;
  padding-left: 10%; // 10% padding from left
  padding-right: 10%; // 10% padding from right
  box-sizing: border-box;
}

// Responsive padding adjustments
@media only screen and (max-width: 1600px) {
  .header-content-container {
      padding-left: 8%;
      padding-right: 8%;
  }
}

@media only screen and (max-width: 1400px) {
  .header-content-container {
      padding-left: 6%;
      padding-right: 6%;
  }
}

@media only screen and (max-width: 1200px) {
  .header-content-container {
      padding-left: 5%;
      padding-right: 5%;
  }
}

@media only screen and (max-width: 992px) {
  .header-content-container {
      padding-left: 4%;
      padding-right: 4%;
  }
}

@media only screen and (max-width: 768px) {
  .header-content-container {
      padding-left: 3%;
      padding-right: 3%;
  }
}

@media only screen and (max-width: 576px) {
  .header-content-container {
      padding-left: 16px;
      padding-right: 16px;
  }
}