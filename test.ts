/* === Container for the search bar === */
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
      color: #8c8c8c;
      font-size: 14px;
      pointer-events: none;
      z-index: 2;
    }
  
    lift-search {
      display: block;
      width: 100%;
    }
  }
  
  /* === Scoped deep style (outside of .searchBox!) === */
  ::ng-deep lift-search input.form-control.shadow-none.border-0 {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    padding-left: 35px !important; // space for search icon
    box-sizing: border-box;
  }
  
  /* === Optional: hover & focus polish === */
  ::ng-deep lift-search input.form-control.shadow-none.border-0:focus {
    outline: none;
    border-color: #0078d4;
    box-shadow: 0 0 3px rgba(0, 120, 212, 0.3);
  }
  