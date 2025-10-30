.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
    border-radius: 8px;
  
    // optional: match white background with subtle border like Figma
    background-color: #fff;
    border: 1px solid #ccc;
  
    .search-icon {
      position: absolute;
      top: 50%;
      left: 12px;
      transform: translateY(-50%);
      color: #999;
      font-size: 14px;
      pointer-events: none; // lets user click inside
      z-index: 2;
    }
  
    lift-search {
      display: block;
      width: 100%;
  
      input {
        width: 100%;
        height: 100%;
        padding-left: 35px !important; // make room for icon
        border: none;
        outline: none;
        font-size: 14px;
      }
    }
  }
  