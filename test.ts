.searchBox {
    position: relative;
    width: 328px;
    height: 40px;
    border-radius: 8px;
  }
  
  .search-icon {
    position: absolute;
    left: 16px; /* Adjust this value to move icon left/right */
    top: 50%;
    transform: translateY(-50%);
    color: #666; /* Darker gray for better visibility */
    font-size: 18px; /* Adjust icon size */
    pointer-events: none;
    z-index: 1;
  }
  
  /* Style the input inside lift-search component */
  .searchBox ::ng-deep input {
    width: 100%;
    height: 40px;
    padding-left: 45px !important; /* Space for icon */
    padding-right: 16px;
    border: 1px solid #e0e0e0; /* Light border */
    border-radius: 8px;
    font-size: 14px;
    background-color: #fff;
    color: #333;
  }
  
  .searchBox ::ng-deep input::placeholder {
    color: #999; /* Lighter placeholder text */
    font-size: 14px;
  }
  
  .searchBox ::ng-deep input:focus {
    outline: none;
    border-color: #4a90e2; /* Blue border on focus */
  }