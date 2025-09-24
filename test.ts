// Dynamic threshold based on zoom level
const baseThreshold = 80; // was 100
const scaleFactor = 400;  // was 500

const minAreaThreshold = Math.max(10, baseThreshold / (this.currentZoom * this.currentZoom));

// Allow small countries to show if zoomed in enough
if (this.currentZoom >= 1.3 && area > minAreaThreshold / 2) {
  return true;
}

return area > minAreaThreshold;
