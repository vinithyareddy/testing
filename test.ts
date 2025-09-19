focusOnCountry(country: CountryCost) {
  if (!country) return;

  // Rotate to country
  this.isRotating = false;
  this.currentRotation = [-country.lng, -country.lat];
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  // Clear existing pins
  this.svg.selectAll('.country-marker').remove();
  
  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];
  const size = this.isMobile ? 20 : 25;

  // Create pin using simple shapes
  const pin = this.svg.append('g').attr('class', 'country-marker');

  // Shadow
  pin.append('ellipse')
    .attr('cx', x + 2).attr('cy', y - size/2 + 2)
    .attr('rx', size/2).attr('ry', size * 0.8)
    .attr('fill', '#000').attr('opacity', 0.2);

  // Main teardrop using circle + triangle
  // Top circle part
  pin.append('circle')
    .attr('cx', x).attr('cy', y - size)
    .attr('r', size/2)
    .attr('fill', '#1a73e8').attr('stroke', '#fff').attr('stroke-width', 2);

  // Bottom triangle part  
  pin.append('path')
    .attr('d', `M ${x} ${y} L ${x - size/3} ${y - size/2} L ${x + size/3} ${y - size/2} Z`)
    .attr('fill', '#1a73e8').attr('stroke', '#fff').attr('stroke-width', 2);

  // White center dot
  pin.append('circle')
    .attr('cx', x).attr('cy', y - size)
    .attr('r', size/5).attr('fill', '#fff');

  // Simple fade in
  pin.style('opacity', 0).transition().duration(300).style('opacity', 1);

  // Remove after 3 seconds
  setTimeout(() => {
    pin.transition().duration(500).style('opacity', 0).remove();
    this.isRotating = true;
  }, 3000);
}