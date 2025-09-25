this.svg.append('image')
  .attr('href', 'assets/images/transparent-globe.png')
  .attr('x', width / 2 - this.currentRadius)
  .attr('y', height / 2 - this.currentRadius)
  .attr('width', this.currentRadius * 2)
  .attr('height', this.currentRadius * 2)
  .style('pointer-events', 'none') // so zoom/drag still work
  .style('opacity', 0.9); // adjust transparency
