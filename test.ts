this.svg.selectAll('.ocean-label')
  .attr('x', (d: any, i: number) => {
    const coords = (this.oceans.features[i].geometry as any).coordinates as [number, number];
    const projected = this.projection(coords);
    return projected ? projected[0] : 0;
  })
  .attr('y', (d: any, i: number) => {
    const coords = (this.oceans.features[i].geometry as any).coordinates as [number, number];
    const projected = this.projection(coords);
    return projected ? projected[1] : 0;
  })
  .style('opacity', (d: any, i: number) => {
    const coords = (this.oceans.features[i].geometry as any).coordinates as [number, number];
    return this.isPointVisible(coords) ? 0.7 : 0;
  });
