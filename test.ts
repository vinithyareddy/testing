private oceans!: FeatureCollection<Geometry, any>;


// Load oceans
this.http.get<any>('assets/json/oceans.json').subscribe(data => {
  this.oceans = data;
  this.drawOceans();
});


private drawOceans() {
  if (!this.oceans) return;

  // Remove old oceans if re-drawing
  this.svg.selectAll('.ocean').remove();
  this.svg.selectAll('.ocean-label').remove();

  // Draw ocean polygons
  this.svg.selectAll('.ocean')
    .data(this.oceans.features)
    .enter()
    .append('path')
    .attr('class', 'ocean')
    .attr('d', this.path)
    .attr('fill', '#b3e5fc') // light blue ocean color
    .attr('stroke', 'none')
    .style('pointer-events', 'none');

  // Add ocean labels
  this.oceans.features.forEach((feature: any) => {
    const centroid = d3.geoCentroid(feature);
    const projected = this.projection(centroid);
    if (projected) {
      this.svg.append('text')
        .attr('class', 'ocean-label')
        .attr('x', projected[0])
        .attr('y', projected[1])
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', '#004d66')
        .style('opacity', 0.6)
        .style('pointer-events', 'none')
        .text(feature.properties.name || '');
    }
  });
}


if (this.oceans) {
  this.svg.selectAll('.ocean')
    .attr('d', this.path);

  this.svg.selectAll('.ocean-label')
    .attr('x', (d: any) => this.projection(d3.geoCentroid(d))[0])
    .attr('y', (d: any) => this.projection(d3.geoCentroid(d))[1]);
}


private drawEquator() {
  const equator = {
    type: 'LineString',
    coordinates: d3.range(-180, 181).map(lon => [lon, 0]) // lat=0
  };

  this.svg.append('path')
    .datum(equator)
    .attr('class', 'equator')
    .attr('d', this.path)
    .attr('stroke', '#444')
    .attr('stroke-dasharray', '4,2')
    .attr('stroke-width', 1)
    .attr('fill', 'none');
}


this.drawEquator();
