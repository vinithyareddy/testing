private updateCountries() {
  // Update country paths
  this.svg.selectAll('.country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d));

  // Update globe circle
  this.svg.select('circle')
    .attr('r', this.currentRadius * this.currentZoom);

  // ✅ Update country labels to move with rotation
  this.svg.selectAll('.country-label')
    .attr("transform", (d: any) => {
      const centroid: [number, number] = this.path.centroid(d) || [0, 0];
      return `translate(${centroid[0]},${centroid[1]})`;
    });
}
