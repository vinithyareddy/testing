if (countryFeature) {
  // Highlight path
  const highlight = this.svg.append('path')
    .datum(countryFeature)
    .attr('class', 'country-highlight')
    .attr('d', this.path)
    .attr('fill', 'none')
    .attr('stroke', '#ff4444')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '8,4')
    .style('opacity', 0);

  highlight.transition()
    .duration(400)
    .style('opacity', 1);

  // Show tooltip at centroid of the country
  const centroid = d3.geoCentroid(countryFeature);
  const projected = this.projection(centroid);
  if (projected) {
    const fakeEvent = {
      clientX: projected[0] + this.globeContainer.nativeElement.getBoundingClientRect().left,
      clientY: projected[1] + this.globeContainer.nativeElement.getBoundingClientRect().top
    };
    this.showTooltip(fakeEvent, countryFeature);
  }

  // Fade highlight
  setTimeout(() => {
    highlight.transition()
      .duration(600)
      .style('opacity', 0)
      .remove();
    this.isRotating = true;
  }, 3000);
}
