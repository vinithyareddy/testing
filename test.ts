<div class="searchBox">
  <i class="fa fa-search search-icon"></i>
  <lift-search [data]="data" [config]="config"></lift-search>
</div>


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
  
  /* Only add padding to move the placeholder/text to the right */
  ::ng-deep .searchBox input {
    padding-left: 40px !important;
  }