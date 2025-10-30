.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 16px;
    pointer-events: none;
    z-index: 10;
  }
  
  /* Target the input with its actual classes */
  ::ng-deep .searchBox input.placeholder-text,
  ::ng-deep .searchBox input {
    width: 328px !important;
    height: 40px !important;
    padding-left: 40px !important;
    padding-right: 12px !important;
    border: 1px solid #ddd !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    box-sizing: border-box !important;
    background-color: #fff !important;
  }
  
  ::ng-deep .searchBox input::placeholder {
    color: #999 !important;
    font-size: 14px !important;
  }