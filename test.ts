private addCountryLabels() {
  this.svg.selectAll('.country-label').remove();
  this.svg.selectAll('.country-label-shadow').remove();

  const usedPositions: Array<{ x: number; y: number }> = [];
  const minDistance = this.isMobile ? 25 : 35;

  this.countries.features.forEach((d: any) => {
    const centroid = d3.geoCentroid(d);
    const projected = this.projection(centroid);

    if (!projected) return;
    const [x, y] = projected;

    const name = d.properties.name;
    if (!name) return;

    // prevent overlap
    let canPlace = true;
    for (const pos of usedPositions) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist < minDistance) {
        canPlace = false;
        break;
      }
    }
    if (!canPlace) return;
    usedPositions.push({ x, y });

    // shadow
    this.svg.append('text')
      .attr('class', 'country-label-shadow')
      .attr('x', x + 1)
      .attr('y', y + 1)
      .attr('text-anchor', 'middle')
      .style('font-size', this.isMobile ? '8px' : '10px')
      .style('fill', 'rgba(0,0,0,0.4)')
      .style('pointer-events', 'none')
      .text(name);

    // main label
    this.svg.append('text')
      .attr('class', 'country-label')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .style('font-size', this.isMobile ? '8px' : '10px')
      .style('font-weight', '600')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', '#111')
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .style('paint-order', 'stroke fill')
      .text(name);
  });
}


private addStateLabels() {
  if (!this.states) return;

  this.svg.selectAll('.state-label').remove();
  this.svg.selectAll('.state-label-shadow').remove();

  const usedPositions: Array<{ x: number; y: number }> = [];
  const minDistance = this.isMobile ? 10 : 18; // tighter than countries

  this.states.features.forEach((d: any) => {
    const centroid = d3.geoCentroid(d);
    const projected = this.projection(centroid);

    if (!projected) return;
    const [x, y] = projected;

    const props = d.properties;
    const label = props.code_hasc || props.iso_3166_2 || props.name;
    if (!label) return;

    // prevent overlaps
    let canPlace = true;
    for (const pos of usedPositions) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
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
      .attr('x', x + 0.8)
      .attr('y', y + 0.8)
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
      .style('fill', '#2b2b2b')
      .style('stroke', 'white')
      .style('stroke-width', '0.6px')
      .style('paint-order', 'stroke fill')
      .text(label);
  });
}
