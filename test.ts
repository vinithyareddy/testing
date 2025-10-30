<div class="searchBox">
  <i class="fa fa-search search-icon"></i>
  <lift-search [data]="data" [config]="config"></lift-search>
</div>

.searchBox {
    position: relative; /* Important for absolute positioning of icon */
    width: 328px;
    height: 40px;
    color: #fff;
    border-radius: 8px;
  }
  
  .search-icon {
    position: absolute;
    left: 12px; /* Adjust distance from left edge */
    top: 50%;
    transform: translateY(-50%); /* Centers icon vertically */
    color: #999; /* Icon color */
    font-size: 16px;
    pointer-events: none; /* Allows clicking through icon to input */
    z-index: 1;
  }
  
  /* Add padding to the actual input inside lift-search */
  .searchBox ::ng-deep input {
    padding-left: 35px; /* Make room for the icon */
  }