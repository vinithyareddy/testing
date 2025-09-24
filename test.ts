// Define a glow filter (brighter + shinier)
const defs = this.svg.append('defs');

const filter = defs.append('filter')
  .attr('id', 'glow')
  .attr('x', '-100%')
  .attr('y', '-100%')
  .attr('width', '300%')
  .attr('height', '300%');

// 1. Big blur for wide halo
filter.append('feGaussianBlur')
  .attr('in', 'SourceGraphic')
  .attr('stdDeviation', 50)   // increase for wider aura
  .attr('result', 'blur1');

// 2. Add color flood
filter.append('feFlood')
  .attr('flood-color', CUSTOM_GLOBE_COLOR)
  .attr('flood-opacity', 1)   // 1 = max bright
  .attr('result', 'flood1');

filter.append('feComposite')
  .attr('in', 'flood1')
  .attr('in2', 'blur1')
  .attr('operator', 'in')
  .attr('result', 'glow1');

// 3. Repeat with a smaller blur for shiny inner glow
filter.append('feGaussianBlur')
  .attr('in', 'SourceGraphic')
  .attr('stdDeviation', 15)
  .attr('result', 'blur2');

filter.append('feFlood')
  .attr('flood-color', CUSTOM_GLOBE_COLOR)
  .attr('flood-opacity', 1)
  .attr('result', 'flood2');

filter.append('feComposite')
  .attr('in', 'flood2')
  .attr('in2', 'blur2')
  .attr('operator', 'in')
  .attr('result', 'glow2');

// 4. Merge everything for brightness
const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'glow1');   // wide aura
feMerge.append('feMergeNode').attr('in', 'glow2');   // shiny core
feMerge.append('feMergeNode').attr('in', 'SourceGraphic'); // actual globe
