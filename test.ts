getapiwidgetdataload(selectedwidgetId: any) {
  // Check if this exact request is already in progress
  if (this.pendingRequests.has(selectedwidgetId)) {
    console.log('⚠️ Duplicate call prevented for:', selectedwidgetId);
    return this.pendingRequests.get(selectedwidgetId);
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
  
  /* Move the placeholder span to the right */
  ::ng-deep .searchBox .placeholder-text {
    padding-left: 28px !important;
    margin-left: 0 !important;
  }
  
  /* Also add padding to the input when user types */
  ::ng-deep .searchBox input {
    padding-left: 40px !important;
  }