private addStateLabels() {
  if (!this.states) return;

  // Bind states
  const labels = this.svg.selectAll<SVGTextElement, any>('.state-label')
    .data(this.states.features, (d: any) => d.properties.code_hasc || d.properties.iso_3166_2 || d.properties.name);

  // EXIT old
  labels.exit().remove();

  // ENTER new
  labels.enter()
    .append('text')
    .attr('class', 'state-label')
    .attr('text-anchor', 'middle')
    .style('font-size', this.isMobile ? '5px' : '7px')
    .style('font-weight', '500')
    .style('font-family', 'Arial, sans-serif')
    .style('fill', '#eee')
    .style('stroke', '#333')
    .style('stroke-width', '0.5px')
    .style('paint-order', 'stroke fill')
    .text((d: any) => d.properties.code_hasc || d.properties.iso_3166_2 || d.properties.name);
}


private updateStates() {
  if (!this.states) return;

  // Update paths
  this.svg.selectAll<SVGPathElement, any>('.state')
    .attr('d', this.path);

  // Update label positions
  this.svg.selectAll<SVGTextElement, any>('.state-label')
    .attr('x', (d: any) => this.projection(d3.geoCentroid(d))?.[0] || 0)
    .attr('y', (d: any) => this.projection(d3.geoCentroid(d))?.[1] || 0);
}
