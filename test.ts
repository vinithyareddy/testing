// Define a glow filter
const defs = this.svg.append('defs');

const filter = defs.append('filter')
  .attr('id', 'glow');

filter.append('feGaussianBlur')
  .attr('stdDeviation', 25)   // blur size, adjust as needed
  .attr('result', 'coloredBlur');

filter.append('feFlood')
  .attr('flood-color', CUSTOM_GLOBE_COLOR) // same as globe color
  .attr('result', 'color');

filter.append('feComposite')
  .attr('in', 'color')
  .attr('in2', 'coloredBlur')
  .attr('operator', 'in')
  .attr('result', 'softGlow');

const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'softGlow');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');


this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', CUSTOM_GLOBE_COLOR)
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1)
  .style('filter', 'url(#glow)');   // <-- apply the glow here
