private addOceanLabels() {
    if (!this.svg) return;
  
    const oceans = [
      { name: 'North Atlantic Ocean', coords: [-30, 20] },
      { name: 'South Atlantic Ocean', coords: [-15, -30] },
      { name: 'Indian Ocean', coords: [80, -20] },
      { name: 'Pacific Ocean', coords: [-150, 0] },
      { name: 'Arctic Ocean', coords: [0, 70] },
      { name: 'Southern Ocean', coords: [0, -60] }
    ];
  
    this.svg.selectAll('.ocean-label').remove();
  
    oceans.forEach(o => {
      const p = this.projection(o.coords);
      if (!p || !this.isPointVisible(o.coords)) return;
      const [x, y] = p;
  
      this.svg.append('text')
        .attr('class', 'ocean-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${8 + this.currentZoom * 1.5}px`)
        .style('fill', '#224c66')              // ocean-blue tone
        .style('font-weight', '500')
        .style('opacity', 0.8)
        .text(o.name);
    });
  
    this.svg.selectAll('.ocean-label').raise();
  }

  

  .style('font-size', `${fontSize}px`)
.style('font-weight', '500')             // a bit lighter for smoother tone
.style('fill', '#1a1a1a')                // dark gray (not full black)
.style('opacity', 0.9)                   // softer contrast
.style('stroke', '#f2f2f2')              // very light gray stroke, not pure white
.style('stroke-width', '0.4px')          // thinner outline
.style('paint-order', 'stroke fill');


.style('font-size', `${fontSize}px`)
.style('font-weight', '500')
.style('fill', '#2d2d2d')                // dark gray-blue tone
.style('opacity', 0.85)
.style('stroke', '#f5f5f5')              // soft edge halo
.style('stroke-width', '0.35px')
.style('paint-order', 'stroke fill');


.style('fill', '#005e8a')                // deeper ocean blue
.style('opacity', 0.7)
.style('font-weight', '500')
.style('stroke', 'none');                // no halo for ocean text


// Draw equator line
const equator = {
    type: 'LineString',
    coordinates: d3.range(-180, 181, 1).map(lon => [lon, 0])
  };
  this.svg.append('path')
    .datum(equator)
    .attr('class', 'equator-line')
    .attr('d', this.path)
    .attr('stroke', '#004d66')        // same bluish tone as before
    .attr('stroke-width', 0.6)
    .attr('opacity', 0.6)
    .attr('fill', 'none');
  