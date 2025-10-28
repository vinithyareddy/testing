// Fix alignment between top-mini-header and main header-sticky
.top-mini-header {
  background-color: #0D3EA1;
  color: #fff;
  font-weight: 500;
  width: 100% !important;
  
  .content-wrapper-section {
      // Match the exact same constraints as header-sticky
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 9px 0 3px 0;
      
      // Remove any conflicting padding
      padding-left: 0 !important;
      padding-right: 0 !important;
      
      .row {
          margin-left: 0;
          margin-right: 0;
          width: 100%;
          
          // Match the horizontal padding from header-sticky
          padding-left: 160px; // Adjust this value based on your header-sticky padding
          padding-right: 160px; // Adjust this value based on your header-sticky padding
      }
  }
  
  .header-main-menu {
      margin-top: 0;
      padding-left: 0;
      margin-bottom: 0;
      
      li {
          font-family: Open Sans;
          font-weight: 600;
          font-size: 14px;
          float: left;
          padding: 3px 9px;
          line-height: 25px;
          text-align: center;
          text-transform: uppercase;
          cursor: pointer;
          margin-right: 25px;
          position: relative;
      }

      li:hover {
          background-color: #000;
      }
  }
}

// Also ensure the main header section aligns the same way
.HeaderNewBgView {
  .content-wrapper-section {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      
      .row {
          // Same padding as top-mini-header
          padding-left: 160px; // Match with top-mini-header
          padding-right: 160px; // Match with top-mini-header
      }
  }
}

// Responsive adjustments
@media only screen and (max-width: 1440px) {
  .top-mini-header .content-wrapper-section .row,
  .HeaderNewBgView .content-wrapper-section .row {
      padding-left: 120px;
      padding-right: 120px;
  }
}

@media only screen and (max-width: 1200px) {
  .top-mini-header .content-wrapper-section .row,
  .HeaderNewBgView .content-wrapper-section .row {
      padding-left: 80px;
      padding-right: 80px;
  }
}

@media only screen and (max-width: 1024px) {
  .top-mini-header .content-wrapper-section .row,
  .HeaderNewBgView .content-wrapper-section .row {
      padding-left: 60px;
      padding-right: 60px;
  }
}

@media only screen and (max-width: 768px) {
  .top-mini-header .content-wrapper-section .row,
  .HeaderNewBgView .content-wrapper-section .row {
      padding-left: 40px;
      padding-right: 40px;
  }
}

@media only screen and (max-width: 576px) {
  .top-mini-header .content-wrapper-section .row,
  .HeaderNewBgView .content-wrapper-section .row {
      padding-left: 16px;
      padding-right: 16px;
  }
}