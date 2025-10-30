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
  
    .search-wrapper {
      width: 100%;
    }
  }
  
  /* === Scoped style only for this page === */
  :host ::ng-deep lift-search input[placeholder="Search"] {
    padding-left: 35px !important; /* shifts both text & caret */
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    color: #333;
    font-size: 14px;
  }
  
  /* Optional hover/focus polish */
  :host ::ng-deep lift-search input[placeholder="Search"]:focus {
    border-color: #0078d4;
    box-shadow: 0 0 3px rgba(0, 120, 212, 0.3);
  }
  