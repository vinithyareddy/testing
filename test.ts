/* Disable page scroll when expanded */
.no-scroll {
  overflow: hidden !important;
}

/* Fullscreen mode styling */
.full-view .budget-card-box-lg {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  background: #fff;
  padding: 24px;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

/* Make the chart fill fullscreen area */
.full-view .inner-card-box.panel {
  height: calc(100vh - 150px) !important;
}
