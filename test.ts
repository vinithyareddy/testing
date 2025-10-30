.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
    color: #fff;
    border-radius: 8px;
  
    // make sure the lift-search box fills correctly
    lift-search {
      display: block;
      width: 100%;
    }
  
    // add the search icon
    &::before {
      content: "\f002"; // FontAwesome search icon
      font-family: "Font Awesome 5 Free"; // make sure font awesome is loaded
      font-weight: 900;
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #888;
      font-size: 14px;
      pointer-events: none; // prevents blocking input clicks
    }
  
    // make space for the icon inside the input field
    input {
      padding-left: 35px !important;
    }
  }
  