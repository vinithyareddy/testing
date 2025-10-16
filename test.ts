// -----------------------------------------
// COUNTRY LABELS (Adaptive + Decluttered)
// -----------------------------------------
private updateCountryLabels() {
    if (!this.countries) return;
    this.svg.selectAll('.country-label').remove();
  
    const usedPositions: Array<{ x: number; y: number }> = [];
    const minAreaThreshold = 50 / (this.currentZoom * this.currentZoom);
  
    const visible = this.countries.features.filter((f: any) => {
      const centroid = d3.geoCentroid(f);
      if (!this.isPointVisible(centroid)) return false;
  
      // Projected area to filter out tiny countries
      const bounds = this.path.bounds(f);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
      return area > minAreaThreshold;
    });
  
    visible.forEach((f: any) => {
      const centroid = this.projection(d3.geoCentroid(f));
      if (!centroid) return;
      const [x, y] = centroid;
  
      // Declutter: skip if too close to another label
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 14);
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

  
  // -----------------------------------------
// STATE LABELS (with Codes + Adaptive Zoom)
// -----------------------------------------
private updateStateLabels() {
    if (!this.states) return;
    this.svg.selectAll('.state-label').remove();
  
    const visibleStates = this.states.features.filter((s: any) => {
      const centroid = d3.geoCentroid(s);
      return this.isPointVisible(centroid);
    });
  
    const largeCountries = ['US', 'IN', 'CA', 'BR', 'CN', 'AU', 'RU'];
  
    visibleStates.forEach((s: any) => {
      const centroid = this.projection(d3.geoCentroid(s));
      if (!centroid) return;
      const [x, y] = centroid;
  
      const props = s.properties;
      let label = props?.iso_3166_2 || props?.code_hasc || props?.name;
      if (label && label.includes('.')) label = label.split('.').pop();
      if (label && label.includes('-')) label = label.split('-').pop();
      if (!label) return;
  
      const countryCode = (props?.iso_a2 || '').toUpperCase();
      const zoomThreshold = largeCountries.includes(countryCode) ? 1.0 : 1.5;
      if (this.currentZoom < zoomThreshold) return;
  
      const fontSize = Math.max(5, Math.min(10, 6 + this.currentZoom * 1.2));
  
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
  }

  // -----------------------------------------
// STATE BORDERS UPDATE (rotation sync)
// -----------------------------------------
private updateStateBorders() {
    if (!this.states || !this.svg) return;
    this.svg
      .selectAll<SVGPathElement, any>('.state-border')
      .attr('d', this.path);
  }

  this.updateCountryLabels();
this.updateStateLabels();


this.updateStateBorders();
