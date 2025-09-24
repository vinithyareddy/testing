// Define a glow filter
const defs = this.svg.append('defs');

const filter = defs.append('filter')
  .attr('id', 'glow')
  .attr('x', '-50%')   // expand filter region so glow isn't cut off
  .attr('y', '-50%')
  .attr('width', '200%')
  .attr('height', '200%');

filter.append('feGaussianBlur')
  .attr('stdDeviation', 40)   // bigger = softer + wider glow
  .attr('result', 'coloredBlur');

filter.append('feFlood')
  .attr('flood-color', CUSTOM_GLOBE_COLOR) // same as ocean color
  .attr('flood-opacity', 1)                // 1 = max brightness
  .attr('result', 'color');

filter.append('feComposite')
  .attr('in', 'color')
  .attr('in2', 'coloredBlur')
  .attr('operator', 'in')
  .attr('result', 'softGlow');

const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'softGlow');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
