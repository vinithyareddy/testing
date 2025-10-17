private updateStateLabels() {
    if (!this.states) return;
  
    // Remove existing labels each frame
    this.svg.selectAll('.state-label').remove();
  
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    // Loop through state features
    this.states.features.forEach((s: any) => {
      const centroid = d3.geoCentroid(s);
      if (!this.isPointVisible(centroid)) return; // hide back side
  
      const projected = this.projection(centroid);
      if (!projected) return;
      const [x, y] = projected;
  
      // Estimate how much screen space this state covers
      const bounds = this.path.bounds(s);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
  
      // Adaptive visibility: large states always visible, small ones need zoom
      const minVisibleArea = 20 / (this.currentZoom * this.currentZoom);
      if (area < minVisibleArea) return; // skip when zoomed out or cramped
  
      // Skip if label would overlap another one
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 10);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      // Adaptive font size — scales naturally with zoom
      const fontSize = Math.max(5, Math.min(10, 5 + this.currentZoom * 1.2));
  
      // Pick an available short identifier (ISO, HASC, or fallback)
      let label = s.properties?.iso_3166_2 || s.properties?.code_hasc || s.properties?.name;
      if (label && label.includes('.')) label = label.split('.').pop();
      if (label && label.includes('-')) label = label.split('-').pop();
      if (!label) return;
  
      this.svg
        .append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '600')
        .style('fill', '#2c3e50')
        .style('stroke', 'white')
        .style('stroke-width', '0.5px')
        .style('paint-order', 'stroke fill')
        .text(label);
    });
  
    // Keep state codes above borders
    this.svg.selectAll('.state-label').raise();
  }
  