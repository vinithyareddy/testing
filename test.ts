private updateCountryLabels() {
    if (!this.countries) return;
  
    // Remove previous labels
    this.svg.selectAll('.country-label').remove();
  
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    // Dynamically adjust threshold based on zoom
    const minAreaThreshold = 50 / (this.currentZoom * this.currentZoom);
  
    // Filter visible + significant countries
    const visible = this.countries.features.filter((f: any) => {
      const centroid = d3.geoCentroid(f);
      if (!this.isPointVisible(centroid)) return false;
  
      // Approximate projected area
      const bounds = this.path.bounds(f);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
      return area > minAreaThreshold;
    });
  
    visible.forEach((f: any) => {
      const centroid = this.projection(d3.geoCentroid(f));
      if (!centroid) return;
      const [x, y] = centroid;
  
      // Avoid overlapping
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 12);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      // Adaptive font size
      const fontSize = Math.max(6, Math.min(12, 7 + this.currentZoom * 1.5));
  
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
  }
  