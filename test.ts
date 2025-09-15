focusOnCountry(country: CountryCost) {
  if (!country) return;

  this.isRotating = false;

  // Target rotation (longitude, latitude)
  const targetRotation = [-country.lng, -country.lat];
  this.currentRotation = targetRotation;
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  // Remove any existing markers first
  this.svg.selectAll('.country-marker').remove();

  // Now compute projected coords AFTER rotation
  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];

  // Add red marker
  const marker = this.svg.append('circle')
    .attr('class', 'country-marker')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 6)
    .attr('fill', 'red')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  // Remove marker after 2s
  setTimeout(() => {
    marker.remove();
    this.isRotating = true;
  }, 2000);
}
