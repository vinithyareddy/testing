// Replace your drawOceans method with this data-driven version:

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
    .attr('fill', 'rgba(163, 213, 245, 0.15)')
    .attr('stroke', 'none')
    .style('pointer-events', 'none');

  // Process each ocean feature from your JSON
  this.oceans.features.forEach((feature: any, index: number) => {
    // Calculate multiple centroids for large ocean polygons
    const oceanCentroids = this.calculateOceanCentroids(feature);
    
    // Get ocean name from properties or generate one
    const oceanName = this.getOceanName(feature, index);
    
    // Place labels at calculated centroids
    oceanCentroids.forEach((centroid, centroidIndex) => {
      const projected = this.projection(centroid);
      if (!projected) return;
      
      const isVisible = this.isPointVisible(centroid);
      if (!isVisible) return;

      const [x, y] = projected;
      
      // Check if we already have a label nearby for this ocean
      if (this.hasNearbyLabel(x, y, oceanName)) return;

      const fontSize = 14;

      // Add shadow
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
        .text(oceanName);

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
        .text(oceanName);
    });
  });
}

// Helper method to calculate multiple centroids for large ocean areas
private calculateOceanCentroids(feature: any): [number, number][] {
  const centroids: [number, number][] = [];
  
  // Get the main centroid
  const mainCentroid = d3.geoCentroid(feature);
  centroids.push(mainCentroid);
  
  // For complex polygons, calculate additional centroids from geometry
  if (feature.geometry && feature.geometry.coordinates) {
    const coords = feature.geometry.coordinates;
    
    if (feature.geometry.type === 'Polygon') {
      // For simple polygons, try to find additional representative points
      const ring = coords[0]; // Outer ring
      if (ring && ring.length > 10) {
        // Calculate centroid of different sections of the polygon
        const quarterLength = Math.floor(ring.length / 4);
        for (let i = 0; i < 4; i++) {
          const sectionStart = i * quarterLength;
          const sectionEnd = Math.min((i + 1) * quarterLength, ring.length - 1);
          const sectionCoords = ring.slice(sectionStart, sectionEnd);
          
          if (sectionCoords.length > 2) {
            // Calculate average of section coordinates
            const avgLng = sectionCoords.reduce((sum, coord) => sum + coord[0], 0) / sectionCoords.length;
            const avgLat = sectionCoords.reduce((sum, coord) => sum + coord[1], 0) / sectionCoords.length;
            centroids.push([avgLng, avgLat]);
          }
        }
      }
    } else if (feature.geometry.type === 'MultiPolygon') {
      // For multi-polygons, calculate centroid of each major polygon
      coords.forEach((polygon: any) => {
        if (polygon[0] && polygon[0].length > 3) {
          const ring = polygon[0];
          const avgLng = ring.reduce((sum: number, coord: any) => sum + coord[0], 0) / ring.length;
          const avgLat = ring.reduce((sum: number, coord: any) => sum + coord[1], 0) / ring.length;
          centroids.push([avgLng, avgLat]);
        }
      });
    }
  }
  
  // Remove duplicates and invalid centroids
  return centroids.filter((centroid, index, self) => {
    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return false;
    
    // Remove near-duplicates
    return self.findIndex(c => 
      Math.abs(c[0] - centroid[0]) < 10 && Math.abs(c[1] - centroid[1]) < 10
    ) === index;
  }).slice(0, 3); // Limit to 3 centroids per ocean
}

// Helper method to determine ocean name from feature properties or index
private getOceanName(feature: any, index: number): string {
  // Try to get name from various possible property fields
  const props = feature.properties || {};
  
  return props.name || 
         props.NAME || 
         props.ocean || 
         props.OCEAN ||
         props.title ||
         props.TITLE ||
         `Ocean ${index + 1}`;
}

// Helper method to check if there's already a nearby label
private hasNearbyLabel(x: number, y: number, oceanName: string): boolean {
  let hasNearby = false;
  
  this.svg.selectAll('.ocean-label').each(function() {
    const existingLabel = d3.select(this);
    const existingX = +existingLabel.attr('x');
    const existingY = +existingLabel.attr('y');
    const distance = Math.sqrt((x - existingX) ** 2 + (y - existingY) ** 2);
    
    // Prevent overlapping labels (same ocean or different oceans too close)
    if (distance < 80) {
      hasNearby = true;
    }
  });
  
  return hasNearby;
}