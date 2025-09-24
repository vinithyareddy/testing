this.svg = d3.select(globeDiv)
  .append('svg')
  .style('position', 'absolute')
  .style('top', '0')
  .style('left', '0')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('preserveAspectRatio', 'xMidYMid meet');