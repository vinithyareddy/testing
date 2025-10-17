private updateCountryLabels() {
    if (!this.countries) return;
  
    // Remove old labels before redrawing
    this.svg.selectAll('.country-label').remove();
  
    const usedPositions: Array<{ x: number; y: number }> = [];
  
    // Adaptive threshold based on zoom (bigger = fewer labels)
    const minAreaThreshold = 60 / (this.currentZoom * this.currentZoom);
  
    // Filter visible + large enough countries
    const visible = this.countries.features.filter((f: any) => {
      const centroid = d3.geoCentroid(f);
      if (!this.isPointVisible(centroid)) return false;
  
      const bounds = this.path.bounds(f);
      const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
      return area > minAreaThreshold;
    });
  
    visible.forEach((f: any) => {
      const centroid = this.projection(d3.geoCentroid(f));
      if (!centroid) return;
      const [x, y] = centroid;
  
      // --- Determine label visibility logic ---
      const largeCountries = ['US', 'CA', 'CN', 'IN', 'RU', 'BR', 'AU'];
      const code = (f.properties?.iso_a2 || '').toUpperCase();
      const isLarge = largeCountries.includes(code);
  
      // For small countries → only show when zoomed in
      if (!isLarge && this.currentZoom < 1.3) return;
  
      // Avoid overlapping
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 12);
      if (tooClose) return;
      usedPositions.push({ x, y });
  
      // Adaptive font size
      const fontSize = isLarge
        ? Math.max(8, Math.min(13, 9 + this.currentZoom * 1.2))
        : Math.max(6, Math.min(10, 6 + this.currentZoom * 1.0));
  
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
  