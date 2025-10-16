private updateCountryLabels() {
    if (!this.countries) return;
  
    this.svg.selectAll('.country-label').remove();
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    const visible = this.countries.features.filter((f: any) => {
      const centroid = d3.geoCentroid(f);
      return this.isPointVisible(centroid);
    });
  
    visible.forEach((f: any) => {
      const centroid = d3.geoCentroid(f);
      const proj = this.projection(centroid);
      if (!proj) return;
      const [x, y] = proj;
  
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 14);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      const countryName = f.properties.name;
      const entry = this.countriesList.find(c => c.country === countryName);
      if (!entry) return;
  
      const bounds = this.path.bounds(f);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
  
      // For small countries, only show when zoomed in
      const showLabel = area > 5000 || this.currentZoom > 1.3;
      if (!showLabel) return;
  
      const fontSize = Math.max(6, Math.min(13, 8 + this.currentZoom * 1.4));
  
      this.svg
        .append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '600')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '0.8px')
        .style('paint-order', 'stroke fill')
        .style('pointer-events', 'none')
        .text(entry.country);
    });
  }

  
  private updateStateLabels() {
    if (!this.states || this.currentZoom < 1.3) {
      this.svg.selectAll('.state-label').remove();
      return;
    }
  
    this.svg.selectAll('.state-label').remove();
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    const visibleStates = this.states.features.filter((s: any) => {
      const centroid = d3.geoCentroid(s);
      return this.isPointVisible(centroid);
    });
  
    visibleStates.forEach((s: any) => {
      const centroid = d3.geoCentroid(s);
      const proj = this.projection(centroid);
      if (!proj) return;
      const [x, y] = proj;
  
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 10);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      // Get state code (2-letter)
      const props = s.properties;
      let label =
        props?.code_hasc ||
        props?.iso_3166_2 ||
        props?.name?.substring(0, 2)?.toUpperCase() ||
        '';
      if (label.includes('.') || label.includes('-'))
        label = label.split(/[.-]/).pop().toUpperCase();
  
      const fontSize = Math.max(4, Math.min(8, 5 + this.currentZoom * 0.8));
  
      // White rounded border background
      this.svg
        .append('rect')
        .attr('x', x - label.length * 3)
        .attr('y', y - fontSize - 2)
        .attr('width', label.length * 6)
        .attr('height', fontSize + 4)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('fill', '#ffffffee')
        .attr('stroke', '#888')
        .attr('stroke-width', 0.4);
  
      this.svg
        .append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '600')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#222')
        .style('pointer-events', 'none')
        .text(label);
    });
  }
  