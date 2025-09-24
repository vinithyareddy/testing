private drawOceans() {
  if (!this.oceans) return;

  this.svg.selectAll('.ocean-label').remove();

  this.oceans.features.forEach((feature: any) => {
    const coords = feature.geometry.coordinates;
    const projected = this.projection([coords[0], coords[1]]);
    if (!projected) return;

    this.svg.append('text')
      .attr('class', 'ocean-label')
      .attr('x', projected[0])
      .attr('y', projected[1])
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#1a4b7a')
      .style('font-weight', '600')
      .style('opacity', 0.7)
      .text(feature.properties.name);
  });
}
