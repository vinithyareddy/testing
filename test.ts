// Fix the typo in updateCountries method - replace this section:

private updateCountries() {
  this.svg.selectAll('.country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d));

  this.svg.select('circle')
    .attr('r', this.currentRadius * this.currentZoom);

  // Update oceans
  if (this.oceans) {
    this.svg.selectAll('.ocean')
      .attr('d', this.path);

    // FIX: Change selectAl to selectAll
    this.svg.selectAll('.ocean-label')
      .attr('x', (d: any, i: number) => {
        const feature = this.oceans.features[i];
        const centroid = d3.geoCentroid(feature);
        const projected = this.projection(centroid);
        return projected ? projected[0] : 0;
      })
      .attr('y', (d: any, i: number) => {
        const feature = this.oceans.features[i];
        const centroid = d3.geoCentroid(feature);
        const projected = this.projection(centroid);
        return projected ? projected[1] : 0;
      })
      .style('opacity', (d: any, i: number) => {
        const feature = this.oceans.features[i];
        const centroid = d3.geoCentroid(feature);
        return this.isPointVisible(centroid) ? 0.7 : 0;
      });
  }

  // Update equator
  this.svg.selectAll('.equator')
    .attr('d', this.path);

  this.updateCountryLabels();
}

// Also improve the drawOceans method:

private drawOceans() {
  if (!this.oceans) return;

  this.svg.selectAll('.ocean').remove();
  this.svg.selectAll('.ocean-label').remove();

  // Draw ocean areas
  this.svg.selectAll('.ocean')
    .data(this.oceans.features)
    .enter()
    .append('path')
    .attr('class', 'ocean')
    .attr('d', this.path)
    .attr('fill', 'rgba(163, 213, 245, 0.3)') // More transparent
    .attr('stroke', 'none')
    .style('pointer-events', 'none');

  // Draw ocean labels
  this.svg.selectAll('.ocean-label')
    .data(this.oceans.features)
    .enter()
    .append('text')
    .attr('class', 'ocean-label')
    .attr('x', (d: any) => {
      const centroid = d3.geoCentroid(d);
      const projected = this.projection(centroid);
      return projected ? projected[0] : 0;
    })
    .attr('y', (d: any) => {
      const centroid = d3.geoCentroid(d);
      const projected = this.projection(centroid);
      return projected ? projected[1] : 0;
    })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .style('font-size', '14px')
    .style('font-weight', '600')
    .style('font-family', 'Arial, sans-serif')
    .style('fill', '#1a5490')
    .style('stroke', 'rgba(255,255,255,0.8)')
    .style('stroke-width', '2px')
    .style('paint-order', 'stroke fill')
    .style('pointer-events', 'none')
    .style('opacity', (d: any) => {
      const centroid = d3.geoCentroid(d);
      return this.isPointVisible(centroid) ? 0.8 : 0;
    })
    .text((d: any) => d.properties.name || d.properties.NAME || '');
}