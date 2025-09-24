// Replace your drawOceans method with this improved version:

private drawOceans() {
  if (!this.oceans) return;

  this.svg.selectAll('.ocean').remove();
  this.svg.selectAll('.ocean-label').remove();
  this.svg.selectAll('.ocean-label-shadow').remove();

  // Draw ocean areas (polygons from your JSON)
  this.svg.selectAll('.ocean')
    .data(this.oceans.features)
    .enter()
    .append('path')
    .attr('class', 'ocean')
    .attr('d', this.path)
    .attr('fill', 'rgba(163, 213, 245, 0.15)') // Very transparent
    .attr('stroke', 'none')
    .style('pointer-events', 'none');

  // Instead of relying on JSON centroids, use fixed strategic positions for ocean labels
  const oceanLabels = [
    { name: 'Pacific Ocean', lat: -10, lng: -150, priority: 1 },
    { name: 'Pacific Ocean', lat: 20, lng: 170, priority: 2 }, // Second Pacific label
    { name: 'Atlantic Ocean', lat: 25, lng: -40, priority: 1 },
    { name: 'Atlantic Ocean', lat: -20, lng: -25, priority: 2 }, // South Atlantic
    { name: 'Indian Ocean', lat: -25, lng: 75, priority: 1 },
    { name: 'Arctic Ocean', lat: 75, lng: -100, priority: 1 },
    { name: 'Southern Ocean', lat: -65, lng: 0, priority: 1 },
    { name: 'Southern Ocean', lat: -65, lng: 90, priority: 2 }, // Additional Southern Ocean
    { name: 'Southern Ocean', lat: -65, lng: -90, priority: 2 } // Additional Southern Ocean
  ];

  // Track which ocean names we've already placed to avoid too much repetition
  const placedLabels = new Set<string>();

  oceanLabels.forEach((ocean) => {
    const projected = this.projection([ocean.lng, ocean.lat]);
    if (!projected) return;
    
    // Check if this ocean position is visible
    const isVisible = this.isPointVisible([ocean.lng, ocean.lat]);
    if (!isVisible) return;

    const [x, y] = projected;
    
    // For oceans we've already labeled, only show if it's high priority and far from existing labels
    if (placedLabels.has(ocean.name) && ocean.priority > 1) {
      // Check if there's already a label of this ocean nearby
      let tooClose = false;
      this.svg.selectAll('.ocean-label').each(function() {
        const existingLabel = d3.select(this);
        if (existingLabel.text() === ocean.name) {
          const existingX = +existingLabel.attr('x');
          const existingY = +existingLabel.attr('y');
          const distance = Math.sqrt((x - existingX) ** 2 + (y - existingY) ** 2);
          if (distance < 100) { // Too close to existing label
            tooClose = true;
          }
        }
      });
      if (tooClose) return;
    }

    placedLabels.add(ocean.name);

    // Determine font size based on ocean importance
    const fontSize = ocean.name.includes('Pacific') || ocean.name.includes('Atlantic') ? 16 : 14;

    // Add shadow for better readability
    this.svg.append('text')
      .attr('class', 'ocean-label-shadow')
      .attr('x', x + 1)
      .attr('y', y + 1)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '600')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', 'rgba(0,0,0,0.4)')
      .style('pointer-events', 'none')
      .text(ocean.name);

    // Add main label
    this.svg.append('text')
      .attr('class', 'ocean-label')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '600')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', '#1a5490')
      .style('stroke', 'rgba(255,255,255,0.9)')
      .style('stroke-width', '2px')
      .style('paint-order', 'stroke fill')
      .style('pointer-events', 'none')
      .style('opacity', 0.85)
      .text(ocean.name);
  });
}

// Also update your updateStates method to include ocean label updates:
private updateStates() {
  if (!this.states) return;

  // Update state paths
  this.svg.selectAll('.state')
    .attr('d', this.path)
    .style('opacity', this.shouldShowStates() ? 1 : 0);

  this.updateStateLabels();
  
  // Also redraw ocean labels when states update (during rotation)
  if (this.oceans) {
    this.drawOceans();
  }
}