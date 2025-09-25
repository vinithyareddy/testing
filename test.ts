// Base teal ocean
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', GLOBE_TEAL_COLOR)
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1);

// Define pattern for land texture
const defs = this.svg.append('defs');
defs.append('pattern')
  .attr('id', 'globe-texture')
  .attr('patternUnits', 'objectBoundingBox')
  .attr('width', 1)
  .attr('height', 1)
  .append('image')
  .attr('href', 'assets/images/globe-texture.png')
  .attr('width', this.currentRadius * 2)
  .attr('height', this.currentRadius * 2)
  .attr('x', 0)
  .attr('y', 0);

// Overlay continents (fixed on top of teal base)
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', 'url(#globe-texture)')
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1);
