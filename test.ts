// Base teal ocean
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', GLOBE_TEAL_COLOR);

// Create mask from PNG (white = ocean will be transparent)
const defs = this.svg.append('defs');
defs.append('mask')
  .attr('id', 'land-mask')
  .append('image')
  .attr('href', 'assets/images/globe-texture.png')
  .attr('width', this.currentRadius * 2)
  .attr('height', this.currentRadius * 2)
  .attr('x', 0)
  .attr('y', 0);

// Apply the mask on top of teal circle
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', 'black')   // mask will keep only land visible
  .attr('mask', 'url(#land-mask)');
