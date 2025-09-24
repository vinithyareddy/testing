private updateCountries() {
  this.svg.selectAll('.country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d));

  this.svg.select('circle')
    .attr('r', this.currentRadius * this.currentZoom);

  // Update oceans
  if (this.oceans) {
    this.svg.selectAll('.ocean')
      .attr('d', this.path);

    this.svg.selectAll<SVGTextElement, any>('.ocean-label')
      .attr('x', (d: any) => this.projection(d3.geoCentroid(d))[0])
      .attr('y', (d: any) => this.projection(d3.geoCentroid(d))[1]);
  }

  // Update equator
  this.svg.selectAll('.equator')
    .attr('d', this.path);

  this.updateCountryLabels();
}
