// 👇 draw base circle *behind* all countries, lighter opacity
this.svg.insert('circle', ':first-child')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', CUSTOM_GLOBE_COLOR)
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1)
  .style('opacity', 0.9)
  .style('filter', 'url(#glow)');
