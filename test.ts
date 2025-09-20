// Responsive breakpoints
$mobile: 768px;
$tablet: 1024px;
$desktop: 1200px;

// Mixins for consistent responsive design
@mixin mobile {
  @media (max-width: #{$mobile - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$mobile}) and (max-width: #{$tablet - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$desktop}) {
    @content;
  }
}

@mixin mobile-tablet {
  @media (max-width: #{$tablet - 1px}) {
    @content;
  }
}

// Header Icons - Responsive
.ellipsis {
  cursor: pointer;
  font-size: 18px;
  margin-left: 12px;
  margin-top: 1px;

  @include mobile {
    font-size: 16px;
    margin-left: 8px;
  }
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: #0071bc;

  @include mobile {
    gap: 8px;
    margin-bottom: 8px;
    justify-content: center;
  }

  i {
    font-size: 16px;
    cursor: pointer;

    @include mobile {
      font-size: 14px;
    }
  }

  .fa-expand {
    margin-top: 7px;

    @include mobile {
      margin-top: 5px;
    }
  }
}

// Widget Header - Responsive Layout
.d-flex.justify-content-between.align-items-center.flex-wrap {
  @include mobile {
    flex-direction: column;
    gap: 15px;
    align-items: stretch !important;
  }

  .widget-heading {
    @include mobile {
      text-align: center;
      font-size: 1.1rem;
      margin-bottom: 0;
    }

    @include tablet {
      font-size: 1.2rem;
    }
  }

  .col-md-8 {
    @include mobile {
      flex: none;
      max-width: 100%;
    }
  }

  .col-md-4 {
    @include mobile {
      flex: none;
      max-width: 100%;
      justify-content: center !important;
    }
  }
}

// Main Widget Container - Responsive
.ss-widget {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  height: 800px;
  transition: all 0.3s ease;

  @include mobile {
    flex-direction: column;
    height: auto;
    min-height: 500px;
  }

  @include tablet {
    height: 600px;
  }

  &.mobile-layout {
    flex-direction: column;
    height: auto;
    min-height: 500px;

    .legend-wrapper {
      width: 100% !important;
      max-height: 300px;
      order: 2;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    }

    .globe-wrapper {
      order: 1;
      min-height: 400px;
      height: 50vh;
    }
  }
}

// Legend Section - Responsive
.legend-wrapper {
  width: 350px;
  padding: 15px;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @include mobile {
    width: 100%;
    max-height: 300px;
    order: 2;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    padding: 12px;
  }

  @include tablet {
    width: 280px;
    padding: 12px;
  }

  &.mobile-legend {
    width: 100% !important;
    max-height: 300px;
    opacity: 1 !important;
    overflow: visible !important;
    order: 2;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }
}

.legend-toggle {
  position: relative;
  display: flex;
  transition: width 0.3s ease;

  @include mobile {
    width: 100% !important;
    position: static;
    
    .toggle-btn {
      display: none; // Hide toggle button on mobile
    }
  }

  .legend-wrapper {
    width: 400px;
    transition: width 0.3s ease, opacity 0.3s ease;

    @include mobile {
      width: 100% !important;
      opacity: 1 !important;
      overflow: visible !important;
    }
  }

  &.collapsed .legend-wrapper {
    width: 0;
    opacity: 0;
    overflow: hidden;

    @include mobile {
      width: 100% !important;
      opacity: 1 !important;
      overflow: visible !important;
    }
  }

  .toggle-btn {
    position: absolute;
    top: 50%;
    right: -6%;
    transform: translateY(-50%);
    background: #fff;
    border: 1px solid #ddd;
    border-left: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 23px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;

    @include tablet {
      width: 20px;
      height: 50px;
    }

    i {
      font-size: 14px;
      color: #374151;

      @include tablet {
        font-size: 12px;
      }
    }
  }
}

// Search Box - Enhanced Modern Design
.search-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @include mobile {
    padding: 14px 16px;
    margin-bottom: 12px;
    border-radius: 14px;
  }

  @include tablet {
    padding: 10px 14px;
    border-radius: 10px;
  }

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }

  &:hover {
    border-color: #cbd5e1;
    background: #ffffff;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-size: 14px;
    color: #1e293b;
    font-weight: 400;
    
    &::placeholder {
      color: #94a3b8;
      font-weight: 400;
    }

    @include mobile {
      font-size: 16px; // Larger for mobile usability
      
      &::placeholder {
        color: #64748b;
      }
    }

    @include tablet {
      font-size: 13px;
    }
  }

  i {
    color: #64748b;
    font-size: 16px;
    margin-left: 8px;
    transition: color 0.2s ease;

    @include mobile {
      font-size: 18px;
      margin-left: 10px;
    }

    @include tablet {
      font-size: 15px;
    }
  }

  &:focus-within i {
    color: #3b82f6;
  }
}

// Country List - Responsive
.country-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  transition: max-height 0.3s ease;

  @include mobile {
    max-height: 200px;
    padding-right: 0;
  }

  @include tablet {
    max-height: 300px;
  }

  // Dynamic height adjustments
  &.mobile-scroll {
    max-height: 200px !important;
    overflow-y: auto !important;
  }

  &.tablet-scroll {
    max-height: 300px !important;
    overflow-y: auto !important;
  }

  &.desktop-scroll {
    max-height: none !important;
    overflow-y: auto !important;
  }
}

.country-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 5px;
  cursor: default;
  transition: background 0.2s ease;

  @include mobile {
    padding: 12px;
    margin-bottom: 8px;
  }

  @include tablet {
    padding: 8px 10px;
  }

  &:hover {
    background: #f9fafb;
  }
}

.country-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  width: 100%;

  .flag-icon {
    width: 22px;
    height: auto;
    margin-right: 8px;
    border-radius: 3px;

    @include mobile {
      width: 24px;
      margin-right: 10px;
    }
  }

  .country-name {
    font-weight: 600;
    font-size: 14px;
    color: #111827;

    @include mobile {
      font-size: 15px;
    }

    @include tablet {
      font-size: 13px;
    }
  }
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: #374151;
  width: 100%;

  @include mobile {
    gap: 4px;
  }

  .metric-labels,
  .metric-values {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    @include mobile {
      gap: 10px;
    }
  }

  .metric-labels {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;

    @include mobile {
      font-size: 13px;
    }
  }

  .metric-values {
    font-size: 14px;
    font-weight: 600;
    color: #111827;

    @include mobile {
      font-size: 15px;
    }

    @include tablet {
      font-size: 13px;
    }
  }
}

// Globe Wrapper - Responsive
.globe-wrapper {
  background: linear-gradient(90deg, #c9d4f0 0%, #b5d6ec 50%, #c9d4f0 100%);
  width: 100%;
  height: 100%;
  margin: 0;
  top: 0;
  position: relative;
  overflow: hidden;

  @include mobile {
    order: 1;
    min-height: 400px;
    height: 50vh;
  }

  @include tablet {
    min-height: 450px;
  }

  .zoom-container {
    position: absolute;
    bottom: 20px;
    right: 50px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;

    @include mobile {
      bottom: 15px;
      right: 15px;
      transform: scale(0.9);
    }

    @include tablet {
      bottom: 15px;
      right: 30px;
      transform: scale(0.95);
    }

    button {
      border: none;
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      cursor: pointer;
      color: #214bcc;

      @include mobile {
        width: 40px;
        height: 40px;
        font-size: 28px;
      }

      @include tablet {
        width: 32px;
        height: 32px;
        font-size: 26px;
      }

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}

// Tooltip - Responsive
:host ::ng-deep .globe-tooltip {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  max-width: 250px;
  pointer-events: none;
  overflow: hidden;
  padding: 0;

  @include mobile {
    max-width: 200px;
    font-size: 12px;
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f3f4f6;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;

    @include mobile {
      padding: 6px 10px;
      font-size: 13px;
      gap: 6px;
    }

    .flag-icon {
      width: 24px;
      height: 18px;
      object-fit: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;

      @include mobile {
        width: 20px;
        height: 15px;
        margin-right: 4px;
      }
    }
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;

    @include mobile {
      padding: 5px 10px;
    }

    .label {
      font-size: 13px;
      color: #374151;

      @include mobile {
        font-size: 12px;
      }
    }

    .value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;

      @include mobile {
        font-size: 12px;
      }
    }
  }
}

// Canvas - Responsive
canvas {
  border-radius: 12px;
  cursor: default;

  @include mobile {
    border-radius: 8px;
  }
}

// Host styling
:host {
  display: block;
  margin: 16px 0;

  @include mobile {
    margin: 12px 0;
  }
}

// View button
.view {
  font-size: 18px;
  color: #0071bc;
  cursor: pointer;
  padding-right: 10px;

  @include mobile {
    font-size: 16px;
    padding-right: 8px;
  }
}

// Info icon
.lift-popover-icon {
  margin-top: -5px;
}

.far.fa-info-circle {
  font-size: 12px;
  margin-left: 4px;

  @include mobile {
    font-size: 11px;
  }
}

// Full View Mode - Responsive
.full-view {
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99999;
  background-color: #fff;
  padding: 20px;

  @include mobile {
    padding: 10px;
  }

  @include tablet {
    padding: 15px;
  }

  .budget-card-box-lg {
    height: 820px !important;

    @include mobile {
      height: calc(100vh - 20px) !important;
    }

    @include tablet {
      height: calc(100vh - 30px) !important;
    }

    .budget-box-chart-lg {
      height: 800px !important;

      @include mobile {
        height: calc(100vh - 40px) !important;
      }

      @include tablet {
        height: calc(100vh - 50px) !important;
      }
    }

    .TableView {
      height: 650px !important;
      max-height: 680px;
      width: 100%;

      @include mobile {
        height: calc(100vh - 150px) !important;
        max-height: calc(100vh - 120px);
      }

      @include tablet {
        height: calc(100vh - 180px) !important;
        max-height: calc(100vh - 150px);
      }
    }
  }

  // Adjust widget in full view mode
  .ss-widget {
    @include mobile {
      height: calc(100vh - 120px);
      min-height: auto;
    }

    @include tablet {
      height: calc(100vh - 150px);
    }
  }
}

// View More Section - Responsive
.viewmore {
  @include mobile {
    text-align: center;
    margin-top: 15px !important;
    padding-top: 15px !important;
    font-size: 14px;
  }

  @include tablet {
    font-size: 15px;
  }
}

// Additional responsive utilities
@include mobile {
  .d-flex.gap-3 {
    gap: 8px !important;
  }
  
  .mt-1 {
    margin-top: 0.5rem !important;
  }
  
  .mt-3 {
    margin-top: 1rem !important;
  }
  
  .pt-3 {
    padding-top: 1rem !important;
  }
}

// Touch-friendly improvements
@include mobile {
  .country-card,
  .toggle-btn,
  .view,
  .ellipsis,
  .zoom-container button {
    min-height: 44px; // Apple's recommended touch target size
    display: flex;
    align-items: center;
  }
  
  .country-card {
    min-height: auto;
    padding: 15px 12px;
  }
}