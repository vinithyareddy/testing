.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
    border-radius: 8px;
  
    .search-icon {
      position: absolute;
      top: 50%;
      left: 12px;
      transform: translateY(-50%);
      color: #999;
      font-size: 14px;
      pointer-events: none;
      z-index: 2;
    }
  
    lift-search {
      display: block;
      width: 100%;
    }
  
    // ✅ Scoped deep style for this component only
    ::ng-deep lift-search input[type="search"],
    ::ng-deep lift-search input {
      padding-left: 35px !important;  // moves placeholder text to the right
      box-sizing: border-box;
    }
  }
  