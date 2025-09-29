focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isRotating = false;

  // Try to find the polygon feature first
  const countryFeature = this.findCountryFeature(country);

  if (countryFeature) {
    // --- Existing highlight logic for polygons ---
    this.currentRotation = [-country.lng, -country.lat];
    this.projection.rotate(this.currentRotation);
    this.updateCountries();
    this.updateStates();

    this.svg.selectAll('.country-highlight').remove();
    const highlight = this.svg.append('path')
      .datum(countryFeature)
      .attr('class', 'country-highlight')
      .attr('d', this.path)
      .attr('fill', 'none')
      .attr('stroke', '#ff4444')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '8,4')
      .style('opacity', 0);

    highlight.transition().duration(400).style('opacity', 1);

    setTimeout(() => {
      highlight.transition().duration(600).style('opacity', 0).remove();
      this.isRotating = true;
    }, 3000);

  } else {
    // --- NEW fallback using lat/lng ---
    this.currentRotation = [-country.lng, -country.lat];
    this.projection.rotate(this.currentRotation);
    this.updateCountries();
    this.updateStates();

    // Add a temporary red dot as marker
    this.svg.selectAll('.country-fallback-marker').remove();
    const projected = this.projection([country.lng, country.lat]);
    if (projected) {
      this.svg.append('circle')
        .attr('class', 'country-fallback-marker')
        .attr('cx', projected[0])
        .attr('cy', projected[1])
        .attr('r', 6)
        .attr('fill', '#ff4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .transition()
        .duration(300)
        .style('opacity', 1);

      setTimeout(() => {
        this.svg.selectAll('.country-fallback-marker').transition()
          .duration(600)
          .style('opacity', 0)
          .remove();
        this.isRotating = true;
      }, 3000);
    }
  }
}
