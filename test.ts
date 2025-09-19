focusOnCountry(country: CountryCost) {
  if (!country) return;

  this.isRotating = false;
  const targetRotation = [-country.lng, -country.lat];
  this.currentRotation = targetRotation;
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  this.svg.selectAll('.country-marker').remove();

  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];

  const pin = this.svg.append('text')
    .attr('class', 'country-marker')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-family', 'Font Awesome 6 Pro')
    .attr('font-weight', '900')
    .attr('font-size', this.isMobile ? 18 : 24)
    .attr('fill', '#1a73e8')
    .text('\uf3c5'); // fa-map-marker-alt

  pin.style('opacity', 0)
    .transition().duration(400).style('opacity', 1);

  setTimeout(() => {
    pin.transition().duration(600).style('opacity', 0).remove();
    this.isRotating = true;
  }, 3000);
}
