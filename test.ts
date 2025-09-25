private handleResize() {
  if (!this.svg || !this.globeContainer) return;

  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  this.currentRadius = this.getResponsiveRadius();

  this.projection
    .scale(this.currentRadius * this.currentZoom)
    .translate([width / 2, height / 2]);

  this.svg.attr('viewBox', `0 0 ${width} ${height}`);

  // ✅ Update teal ocean circle
  this.svg.select('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', this.currentRadius * this.currentZoom);

  // ✅ Update overlay transparent land PNG
  this.svg.select('image')
    .attr('x', width / 2 - this.currentRadius * this.currentZoom)
    .attr('y', height / 2 - this.currentRadius * this.currentZoom)
    .attr('width', this.currentRadius * 2 * this.currentZoom)
    .attr('height', this.currentRadius * 2 * this.currentZoom)
    .attr(
      'clip-path',
      `circle(${this.currentRadius * this.currentZoom}px at ${width / 2}px ${height / 2}px)`
    );

  this.updateCountries();
  this.updateStates();
}
