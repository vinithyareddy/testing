focusOnCountry(country: CountryCost) {
  if (!country) return;

  this.isRotating = false;
  this.currentRotation = [-country.lng, -country.lat];
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  this.svg.selectAll('.country-marker').remove();
  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];
  const size = this.isMobile ? 12 : 16;

  const pin = this.svg.append('g').attr('class', 'country-marker');

  // Shadow
  pin.append('ellipse')
    .attr('cx', x + 2).attr('cy', y + 2) 
    .attr('rx', size * 0.7).attr('ry', size)
    .attr('fill', 'black').attr('opacity', 0.2);

  // Main circle
  pin.append('circle')
    .attr('cx', x).attr('cy', y - size).attr('r', size)
    .attr('fill', '#4285f4').attr('stroke', 'white').attr('stroke-width', 2);

  // Triangle pointer  
  pin.append('polygon')
    .attr('points', `${x},${y} ${x-size/2},${y-size/2} ${x+size/2},${y-size/2}`)
    .attr('fill', '#4285f4').attr('stroke', 'white').attr('stroke-width', 2);

  // White center
  pin.append('circle')
    .attr('cx', x).attr('cy', y - size).attr('r', size * 0.4).attr('fill', 'white');

  // Animation
  pin.style('opacity', 0).transition().duration(300).style('opacity', 1);

  setTimeout(() => {
    pin.transition().duration(500).style('opacity', 0).remove();
    this.isRotating = true;
  }, 3000);
}