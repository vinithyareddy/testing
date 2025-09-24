private addStateLabels() {
  if (!this.states) return;

  this.svg.selectAll('.state-label').remove();
  this.svg.selectAll('.state-label-shadow').remove();

  const usedPositions: Array<{ x: number, y: number }> = [];
  const minDistance = this.isMobile ? 10 : 18; // tighter spacing than countries

  this.states.features.forEach((d: any) => {
    const centroid = d3.geoCentroid(d);
    const projected = this.projection(centroid);

    if (!projected || isNaN(projected[0]) || isNaN(projected[1])) return;
    const [x, y] = projected;

    const props = d.properties;
    const label = props.code_hasc || props.iso_3166_2 || props.name;
    if (!label) return;

    // avoid overlaps
    let canPlace = true;
    for (const pos of usedPositions) {
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < minDistance) {
        canPlace = false;
        break;
      }
    }
    if (!canPlace) return;
    usedPositions.push({ x, y });

    // shadow
    this.svg.append('text')
      .attr('class', 'state-label-shadow')
      .attr('x', x + 0.5)
      .attr('y', y + 0.5)
      .attr('text-anchor', 'middle')
      .style('font-size', this.isMobile ? '5px' : '7px')
      .style('fill', 'rgba(0,0,0,0.4)')
      .style('pointer-events', 'none')
      .text(label);

    // main label
    this.svg.append('text')
      .attr('class', 'state-label')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .style('font-size', this.isMobile ? '5px' : '7px')
      .style('font-weight', '500')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', '#eee') // bright like in pic 2
      .style('stroke', '#333')
      .style('stroke-width', '0.5px')
      .style('paint-order', 'stroke fill')
      .text(label);
  });
}
