zoomIn() {
  // Example: increase zoom level
  this.currentZoom = Math.min(this.currentZoom + 0.2, this.maxZoom);
  this.updateZoom();
}

zoomOut() {
  // Example: decrease zoom level
  this.currentZoom = Math.max(this.currentZoom - 0.2, this.minZoom);
  this.updateZoom();
}

updateZoom() {
  if (this.globe) {
    this.globe.pointOfView({ lat: this.currentLat, lng: this.currentLng, altitude: this.currentZoom });
  }
}
