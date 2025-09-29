if (!countryFeature) {
  // Fallback: draw a red dot marker if no polygon exists
  const projected = this.projection([country.lng, country.lat]);
  if (projected) {
    this.svg.selectAll('.country-fallback-marker').remove();
    this.svg.append('circle')
      .attr('class', 'country-fallback-marker')
      .attr('cx', projected[0])
      .attr('cy', projected[1])
      .attr('r', 6)
      .attr('fill', '#ff4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Show tooltip at this location
    const fakeEvent = {
      clientX: projected[0] + this.globeContainer.nativeElement.getBoundingClientRect().left,
      clientY: projected[1] + this.globeContainer.nativeElement.getBoundingClientRect().top
    };
    this.showTooltip(fakeEvent, { properties: { name: country.country } });

    // Clean up after 3s
    setTimeout(() => {
      this.svg.selectAll('.country-fallback-marker').remove();
      this.hideTooltip();
      this.isRotating = true;
    }, 3000);
  }
  return; // stop here, don’t try polygon highlight
}
