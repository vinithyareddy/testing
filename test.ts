private addStateLabels() {
  if (!this.states) return;
  this.svg.selectAll('.state-label').remove();

  this.states.features.forEach((d: any) => {
    const centroid = this.path.centroid(d);
    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;

    const [x, y] = centroid;
    const props = d.properties;
    const label = props.code_hasc || props.iso_3166_2 || props.name;

    // Only add labels if the centroid is on the visible hemisphere
    if (this.isPointInFrontHemisphere(x, y)) {
      this.svg.append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', this.isMobile ? '5px' : '7px')
        .style('fill', '#555')
        .text(label);
    }
  });
}
