zoomIn() {
  this.currentZoom = Math.max(this.currentZoom - ZOOM_STEP, MIN_ZOOM);
  this.updateCameraZoom();
}

zoomOut() {
  this.currentZoom = Math.min(this.currentZoom + ZOOM_STEP, MAX_ZOOM);
  this.updateCameraZoom();
}

private updateCameraZoom() {
  if (this.controls.object instanceof THREE.OrthographicCamera) {
    this.controls.object.position.z = this.currentZoom;
  }
}

const aspect = globeDiv.offsetWidth / globeDiv.offsetHeight;
const d = 250; // zoom scaling factor (adjust for size)

const camera = new THREE.OrthographicCamera(
  -d * aspect,  // left
  d * aspect,   // right
  d,            // top
  -d,           // bottom
  0.1,          // near
  2000          // far
);

camera.position.set(0, 0, this.currentZoom); // z distance
camera.lookAt(0, 0, 0);
