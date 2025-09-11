<div class="legend-toggle" [class.collapsed]="legendCollapsed">
  <div class="legend-wrapper">
    <!-- Existing legend code -->
  </div>
  <button class="toggle-btn" (click)="legendCollapsed = !legendCollapsed">
    <i class="fas" [ngClass]="legendCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
  </button>
</div>


.legend-toggle {
  position: relative;
  transition: width 0.3s ease;
  display: flex;

  &.collapsed .legend-wrapper {
    width: 0;
    opacity: 0;
    overflow: hidden;
  }

  .toggle-btn {
    position: absolute;
    top: 50%;
    right: -12px;
    transform: translateY(-50%);
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }
}
.globe-wrapper {
  width: 100%;
  height: 100%;   // instead of 80vh
  margin: 0;      // remove auto margin
  position: relative;
  top: 0;
}

.ss-widget {
  height: calc(100vh - 120px); // adjust based on header height
}

.zoom-container {
  position: absolute;
  bottom: 20px;
  left: 20px; // move it closer to left
  z-index: 20; // make sure it's on top of canvas
  display: flex;
  flex-direction: column;
}
