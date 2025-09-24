const defs = this.svg.append('defs');

// Define a radial gradient for the glow
const gradient = defs.append('radialGradient')
  .attr('id', 'glowGradient')
  .attr('cx', '50%')
  .attr('cy', '50%')
  .attr('r', '50%');

// Inner color (brighter center)
gradient.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', '#84c9f6')   // light blue
  .attr('stop-opacity', 1);

// Outer color (fades outwards)
gradient.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', '#a6d785')   // light green
  .attr('stop-opacity', 0.8);

// Define the filter
const filter = defs.append('filter')
  .attr('id', 'glow')
  .attr('x', '-50%')
  .attr('y', '-50%')
  .attr('width', '200%')
  .attr('height', '200%');

// Blur effect
filter.append('feGaussianBlur')
  .attr('stdDeviation', 40)
  .attr('result', 'coloredBlur');

// Apply gradient as flood
filter.append('feFlood')
  .attr('flood-color', 'url(#glowGradient)')
  .attr('result', 'color');

// Combine
filter.append('feComposite')
  .attr('in', 'color')
  .attr('in2', 'coloredBlur')
  .attr('operator', 'in')
  .attr('result', 'softGlow');

const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'softGlow');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
