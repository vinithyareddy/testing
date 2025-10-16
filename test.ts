// --------------------------
// DRAW STATE BORDERS
// --------------------------
private drawStates() {
    if (!this.states) return;
  
    // Remove any old paths
    this.svg.selectAll('.state-border').remove();
  
    // Draw new paths with thin outline
    this.svg
      .selectAll('.state-border')
      .data(this.states.features)
      .enter()
      .append('path')
      .attr('class', 'state-border')
      .attr('d', this.path)
      .attr('fill', 'transparent')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.8)
      .style('pointer-events', 'none');
  }

  

  private updateStateLabels() {
    if (!this.states) return;
  
    this.svg.selectAll('.state-label').remove();
  
    const visibleStates = this.states.features.filter((s: any) => {
      const centroid = d3.geoCentroid(s);
      return this.isPointVisible(centroid);
    });
  
    visibleStates.forEach((s: any) => {
      const centroid = this.projection(d3.geoCentroid(s));
      if (!centroid) return;
      const [x, y] = centroid;
  
      const props = s.properties;
      // Extract best available short code
      let label = props?.iso_3166_2 || props?.code_hasc || props?.name;
      if (label && label.includes('.')) label = label.split('.').pop();
      if (label && label.includes('-')) label = label.split('-').pop();
      if (!label) return;
  
      // --- Adaptive visibility logic ---
      // For small countries → show only when zoomed in deeply
      // For large ones → always show
      const largeCountries = ['US', 'IN', 'CA', 'BR', 'CN', 'AU', 'RU'];
      const countryCode = (props?.iso_a2 || '').toUpperCase();
      const zoomThreshold = largeCountries.includes(countryCode) ? 1.0 : 1.4;
  
      if (this.currentZoom < zoomThreshold) return;
  
      // Adaptive font size based on zoom
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

  
  this.loadStates = () => {
    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      this.states = topojson.feature(data, data.objects.ne_50m_admin_1_states_provinces) as any;
      this.drawStates(); // 👈 add this line
    });
  };
  