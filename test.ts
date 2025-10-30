.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 12px;
    color: #888;
    font-size: 16px;
    pointer-events: none;
    z-index: 10;
  }
  
  /* Target the input directly */
  ::ng-deep .searchBox lift-search input,
  ::ng-deep .searchBox lift-search .search-input,
  ::ng-deep .searchBox input {
    width: 100% !important;
    height: 40px !important;
    padding-left: 40px !important;
    border: 1px solid #ddd !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
  }