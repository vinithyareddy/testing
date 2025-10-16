private updateCountryLabels() {
    if (!this.countries) return;
  
    // Remove previous labels
    this.svg.selectAll('.country-label').remove();
  
    // Define used positions to prevent overlaps
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    // Compute visible countries (front side only)
    const visible = this.countries.features.filter((f: any) => {
      const centroid = d3.geoCentroid(f);
      return this.isPointVisible(centroid);
    });
  
    visible.forEach((f: any) => {
      const centroid = d3.geoCentroid(f);
      const proj = this.projection(centroid);
      if (!proj) return;
      const [x, y] = proj;
  
      // Skip overlapping labels
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 12);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      const countryName = f.properties.name;
      const entry = this.countriesList.find(c => c.country === countryName);
      if (!entry) return;
  
      // Approximate area heuristic (to decide label visibility)
      const bounds = this.path.bounds(f);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
  
      // Decide if label should show (small countries only at higher zoom)
      const showAlways = area > 8000 || this.currentZoom > 1.4;
      if (!showAlways && this.currentZoom < 1.2) return;
  
      // Show code (short label) for smaller countries
      const labelText = area > 7000 ? entry.code.toUpperCase() : entry.code.toUpperCase();
  
      const fontSize = Math.max(6, Math.min(12, 8 + this.currentZoom * 1.3));
  
      this.svg
        .append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '700')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .style('paint-order', 'stroke fill')
        .style('pointer-events', 'none')
        .text(labelText);
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
  
      // Determine short label (ISO or HASC)
      const props = s.properties;
      let label =
        props?.code_hasc ||
        props?.iso_3166_2 ||
        props?.name?.substring(0, 3)?.toUpperCase() ||
        '';
      if (label.includes('.') || label.includes('-'))
        label = label.split(/[.-]/).pop().toUpperCase();
  
      const fontSize = Math.max(4, Math.min(8, 6 + this.currentZoom * 0.8));
  
      // Add white border rectangle (for contrast)
      this.svg
        .append('rect')
        .attr('x', x - label.length * 2.8)
        .attr('y', y - fontSize)
        .attr('width', label.length * 5.5)
        .attr('height', fontSize + 4)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', '#ffffffcc')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5);
  
      // Add label text
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
  