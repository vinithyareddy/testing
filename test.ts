focusOnCountry(country: CountryCost) {
  if (!country) return;

  // Stop auto-rotation while focusing
  this.isRotating = false;

  // Get the vector position for the country
  const pos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // Calculate screen projection for tooltip/marker
  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];

  // Add a temporary red circle (marker) on the globe
  const marker = this.svg.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 6)
    .attr('fill', 'red')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  // Remove marker after 2 seconds
  setTimeout(() => {
    marker.remove();
    this.isRotating = true;
  }, 2000);

  // Rotate globe smoothly toward the country
  const targetRotation = [-country.lng, -country.lat];
  this.currentRotation = targetRotation;
  this.projection.rotate(this.currentRotation);
  this.updateCountries();
}
