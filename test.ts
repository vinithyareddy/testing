this.svg = d3.select(globeDiv)
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .style('visibility', 'hidden')           // ⬅ hide initially
  .style('shape-rendering', 'crispEdges'); // ⬅ no progressive anti-aliasing
