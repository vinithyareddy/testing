focusOnCountry(country: CountryCost) {
  if (!country) return;

  // Stop rotation and focus on country
  this.isRotating = false;
  this.currentRotation = [-country.lng, -country.lat];
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  // Clear existing markers and get coordinates
  this.svg.selectAll('.country-marker').remove();
  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];
  const size = this.isMobile ? 24 : 30;

  // Create pin group
  const pin = this.svg.append('g').attr('class', 'country-marker');

  // Pin shadow
  pin.append('ellipse')
    .attr('cx', x + 3).attr('cy', y - size/2 + 3)
    .attr('rx', size/2).attr('ry', size * 0.8)
    .attr('fill', '#000').attr('opacity', 0.2);

  // Main teardrop body (circle + triangle combined)
  pin.append('circle')
    .attr('cx', x).attr('cy', y - size)
    .attr('r', size/2)
    .attr('fill', '#1a73e8')
    .attr('stroke', '#fff').attr('stroke-width', 2);

  pin.append('path')
    .attr('d', `M ${x} ${y} L ${x - size/3} ${y - size/2} A ${size/6} ${size/6} 0 0 1 ${x + size/3} ${y - size/2} Z`)
    .attr('fill', '#1a73e8')
    .attr('stroke', '#fff').attr('stroke-width', 2);

  // White center dot
  pin.append('circle')
    .attr('cx', x).attr('cy', y - size)
    .attr('r', size * 0.25)
    .attr('fill', '#fff');

  // Simple animation
  pin.style('opacity', 0)
    .transition().duration(400)
    .style('opacity', 1);

  // Remove after 3 seconds
  setTimeout(() => {
    pin.transition().duration(600).style('opacity', 0).remove();
    this.isRotating = true;
  }, 3000);
}