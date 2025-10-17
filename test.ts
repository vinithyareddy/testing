private updateCountryLabels() {
    if (!this.countries) return;
  
    // Remove previous labels
    this.svg.selectAll('.country-label').remove();
  
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    // Loop through countries
    this.countries.features.forEach((f: any) => {
      const centroid = d3.geoCentroid(f);
      if (!this.isPointVisible(centroid)) return; // skip back side
  
      const projected = this.projection(centroid);
      if (!projected) return;
      const [x, y] = projected;
  
      // Approximate on-screen area from path bounds
      const bounds = this.path.bounds(f);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
  
      // Adaptive visibility: larger countries always visible,
      // smaller ones only visible when zoomed in
      const minVisibleArea = 80 / (this.currentZoom * this.currentZoom); // smaller = show more labels
      if (area < minVisibleArea) return; // skip small countries when zoomed out
  
      // Prevent label overlaps
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 14);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      // Adaptive font size by zoom (no hardcode)
      const fontSize = Math.max(6, Math.min(12, 6 + this.currentZoom * 1.5));
  
      this.svg
        .append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '600')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '0.6px')
        .style('paint-order', 'stroke fill')
        .text(f.properties.name);
    });
  
    // Keep labels on top of all paths
    this.svg.selectAll('.country-label').raise();
  }
  