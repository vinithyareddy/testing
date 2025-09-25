// Define globe pattern fill using the PNG texture
const defs = this.svg.append('defs');
defs.append('pattern')
  .attr('id', 'globe-texture')
  .attr('patternUnits', 'objectBoundingBox')
  .attr('width', 1)
  .attr('height', 1)
  .append('image')
  .attr('href', 'assets/images/globe-texture.png')
  .attr('preserveAspectRatio', 'xMidYMid slice')
  .attr('width', width)
  .attr('height', height)
  .attr('x', 0)
  .attr('y', 0);

// Circle with teal overlay + texture
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', 'url(#globe-texture)')
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1)
  .style('filter', 'url(#glow)')
  .style('fill', `url(#globe-texture), ${CUSTOM_GLOBE_COLOR}`); 
