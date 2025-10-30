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
  }
  
  /* ✅ ng-deep must be outside */
  ::ng-deep lift-search input.form-control.shadow-none.border-0 {
    padding-left: 35px !important;   // pushes search text right
    box-sizing: border-box;
  }
  