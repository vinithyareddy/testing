private addStateLabels() {
  if (!this.states) return;

  this.svg.selectAll('.state-label').remove();
  this.svg.selectAll('.state-label-shadow').remove();

  // Sort states to prioritize visibility (optional: by area or code)
  const labeledStates = this.states.features;

  const usedPositions: Array<{ x: number; y: number }> = [];
  const minDistance = this.isMobile ? 12 : 20; // tighter spacing than countries

  labeledStates.forEach((d: any) => {
    const centroid = this.path.centroid(d);
    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;

    const [x, y] = centroid;
    const props = d.properties;
    const label = props.code_hasc || props.iso_3166_2 || props.name;

    // Only show if in visible hemisphere
    const coords = d3.geoCentroid(d); // true lat/lon
    if (!this.isPointInFrontHemisphere(coords[0], coords[1])) return;

    const globeDiv = this.globeContainer.nativeElement;
    const centerX = globeDiv.offsetWidth / 2;
    const centerY = globeDiv.offsetHeight / 2;

    // Distance from globe center
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = this.currentRadius * this.currentZoom * 0.95;
    if (distance > maxDistance) return;

    // Prevent overlaps
    let canPlace = true;
    for (const pos of usedPositions) {
      const labelDistance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (labelDistance < minDistance) {
        canPlace = false;
        break;
      }
    }
    if (!canPlace) return;
    usedPositions.push({ x, y });

    // Opacity fade near edge
    const normalizedDistance = distance / maxDistance;
    const opacity = Math.max(0.4, Math.min(1, 1 - normalizedDistance * 0.3));

    // Shadow (for better contrast)
    this.svg.append('text')
      .attr('class', 'state-label-shadow')
      .attr('x', x + 0.5)
      .attr('y', y + 0.5)
      .attr('text-anchor', 'middle')
      .style('font-size', this.isMobile ? '5px' : '7px')
      .style('font-weight', '500')
      .style('fill', 'rgba(0,0,0,0.5)')
      .style('opacity', opacity * 0.7)
      .text(label);

    // Foreground label
    this.svg.append('text')
      .attr('class', 'state-label')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .style('font-size', this.isMobile ? '5px' : '7px')
      .style('font-weight', '500')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', '#333')
      .style('stroke', 'white')
      .style('stroke-width', '0.8px')
      .style('paint-order', 'stroke fill')
      .style('opacity', opacity)
      .text(label);
  });
}
