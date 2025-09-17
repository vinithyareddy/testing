.budget-card-box-lg.fullscreen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 9999;
    background: #fff;
    padding: 20px;
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
  
    .budget-box-chart-lg {
      height: 100%;
    }
  
    highcharts-chart, .data-table {
      height: calc(100vh - 120px) !important;
      width: 100% !important;
    }
  }
  
  .data-table {
    width: 95%;
    margin: 0 auto;
    border-collapse: collapse;
  
    th, td {
      border: 1px solid #ccd5df;
      padding: 8px 12px;
      text-align: left;
    }
  
    th {
      background: #f0f4f8;
      font-weight: 600;
    }
  }
  