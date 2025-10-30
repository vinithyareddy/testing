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
    color: #666;
    font-size: 16px;
    pointer-events: none;
    z-index: 10;
  }
  
  /* Remove any wrapper styling from lift-search */
  ::ng-deep .searchBox lift-search {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    background: transparent !important;
  }
  
  /* Style the actual input */
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
    margin: 0 !important;
  }
  
  ::ng-deep .searchBox input::placeholder {
    color: #999 !important;
    font-size: 14px !important;
  }
  
  /* Hide any built-in icon from lift-search if it exists */
  ::ng-deep .searchBox lift-search .search-icon,
  ::ng-deep .searchBox lift-search i {
    display: none !important;
  }