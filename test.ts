// Responsive breakpoints
$mobile: 767px;
$tablet: 1024px;

// Mixins for cleaner code
@mixin mobile {
  @media (max-width: $mobile) { @content; }
}

@mixin tablet {
  @media (min-width: #{$mobile + 1px}) and (max-width: $tablet) { @content; }
}

// Main container - only what's needed
.budget-card-box-lg {
  &.fullscreen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 9999;
    background: #fff;
    padding: 20px;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    
    @include mobile { padding: 10px; }
  }
}

// Header responsiveness
.widget-heading .title-with-icon {
  @include mobile {
    font-size: 14px;
    justify-content: center;
  }
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  @include mobile {
    justify-content: center;
    gap: 15px;
  }
  
  i {
    font-size: 16px;
    cursor: pointer;
    @include mobile { font-size: 18px; }
  }
  
  .fa-expand { color: #0071bc; }
  .ellipsis { color: #0071bc; font-size: 18px; }
}

// Globe layout
.globe-wrapper {
  display: flex;
  justify-content: space-between;
  background: #154361;
  padding: 15px;
  color: #fff;
  position: relative;
  min-height: 400px;
  
  @include mobile {
    flex-direction: column;
    padding: 10px;
    min-height: 300px;
  }
}

.globe-container {
  width: 70%;
  height: 800px;
  min-height: 300px;
  
  @include mobile {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
  
  @include tablet {
    width: 65%;
    height: 500px;
  }
  
  svg {
    width: 100% !important;
    height: 100% !important;
  }
}

// Zoom controls
.zoom-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  
  @include mobile {
    bottom: 10px;
    left: 10px;
  }
  
  button {
    background: #fff;
    border: 1px solid #ccc;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    color: #214bcc;
    width: 40px;
    height: 40px;
    
    &:hover { background-color: #f0f0f0; }
    
    @include mobile {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }
  }
}

// Legend
.legend-wrapper {
  width: 25%;
  margin-top: 120px;
  margin-right: 20px;
  
  @include mobile {
    width: 100%;
    margin-top: 0;
    margin-right: 0;
    max-height: 300px;
    overflow-y: auto;
  }
  
  @include tablet {
    width: 30%;
    margin-top: 50px;
  }
}

.legend-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  
  @include mobile {
    font-size: 1rem;
    text-align: center;
  }
}

// Table styles - only essentials
.legend-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.9rem;
  color: #000;
  
  @include mobile { font-size: 0.8rem; }
  
  th, td {
    padding: 10px;
    @include mobile { padding: 8px 5px; }
  }
  
  th:first-child {
    text-align: left !important;
    padding-left: 30px !important;
    @include mobile { padding-left: 15px !important; }
  }
  
  th.right, td.cost-col { text-align: right; }
  
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.2s ease;
    &:hover { background-color: #f1f5f9; }
  }
}

// Scrollable functionality
.legend-wrapper.scrollable .legend-table {
  display: block;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  
  @include mobile { max-height: 250px; }
  
  thead {
    position: sticky;
    top: 0;
    background: #f8f9fa;
    z-index: 1;
    display: table-header-group;
  }
  
  tbody { display: block; }
  tr { display: table; width: 100%; table-layout: fixed; }
}

// Country scroll
.country-scroll {
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #eee;
  
  @include mobile { max-height: 150px; }
  
  table { width: 100%; border-collapse: collapse; }
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:hover { background-color: #f1f5f9; }
  }
}

// Dropdown
.custom-dropdown {
  @include mobile {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .btn {
    padding: 2px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    background: #fff;
    width: 200px;
    
    @include mobile {
      width: 100%;
      max-width: 200px;
    }
  }
  
  .dropdown-menu {
    font-size: 14px;
    min-width: 140px;
    z-index: 2000 !important;
    position: absolute;
    margin-top: 4px;
    
    @include mobile {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 300px;
    }
  }
  
  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    
    &:hover { background-color: #f5f5f5; }
    i { color: #007bff; }
  }
}

// Icons and small elements
.flag-icon {
  width: 20px;
  margin-right: 8px;
  vertical-align: middle;
  
  @include mobile {
    width: 16px;
    margin-right: 5px;
  }
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
  
  @include mobile { gap: 5px; }
}

// Tooltip
:host ::ng-deep .tooltip-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 160px;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background: #fff;
  margin-left: 20px;
  
  @include mobile {
    width: 140px;
    font-size: 12px;
    margin-left: 10px;
  }
  
  .tooltip-row {
    padding: 6px 10px;
    @include mobile { padding: 5px 8px; }
  }
  
  .tooltip-header {
    background: #f4f6f9;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #000 !important;
    
    @include mobile { gap: 4px; }
  }
  
  .tooltip-body {
    background: #fff;
    color: #000;
    display: flex;
    justify-content: space-between;
  }
  
  img {
    width: 20px;
    height: 14px;
    border: 1px solid #ccc;
    
    @include mobile {
      width: 16px;
      height: 12px;
    }
  }
}

// Utility classes for mobile
@include mobile {
  .d-flex.justify-content-between {
    flex-direction: column !important;
    align-items: center !important;
    gap: 10px;
  }
  
  .col-md-8, .col-md-4 {
    width: 100% !important;
    max-width: 100% !important;
    flex: none !important;
  }
  
  .viewmore {
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
  }
}