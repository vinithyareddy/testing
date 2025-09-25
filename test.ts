private drawCountries() {
  this.svg.selectAll('.country').remove();

  this.svg.selectAll('.country')
    .data(this.countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d))
    .attr('stroke', STROKE_COLOR_COUNTRY)
    .attr('stroke-width', 0.5);

  // Hover layer (optional)
  this.svg.selectAll('.country-hover')
    .data(this.countries.features)
    .enter()
    .append('path')
    .attr('class', 'country-hover')
    .attr('d', this.path)
    .attr('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('mouseover', (event: any, d: any) => {
      this.isRotating = false;
      this.showTooltip(event, d);
    })
    .on('mousemove', (event: any) => this.moveTooltip(event))
    .on('mouseout', () => {
      if (!this.isDragging) this.isRotating = true;
      this.hideTooltip();
    });

  this.updateCountryLabels();
}
