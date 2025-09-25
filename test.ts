private initializeGlobe() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  this.currentRadius = this.getResponsiveRadius();

  // Setup projection (still needed for rotation/zoom if you keep them)
  this.projection = d3.geoOrthographic()
    .scale(this.currentRadius)
    .translate([width / 2, height / 2])
    .clipAngle(90);
  this.projection.rotate([0, 0]);

  this.path = d3.geoPath().projection(this.projection);

  // Remove old globe if re-rendering
  d3.select(globeDiv).selectAll('svg').remove();

  this.svg = d3.select(globeDiv)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Glow effect
  const defs = this.svg.append('defs');
  const filter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-100%')
    .attr('y', '-100%')
    .attr('width', '300%')
    .attr('height', '300%');

  filter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 50)
    .attr('result', 'blur1');

  filter.append('feFlood')
    .attr('flood-color', '#d5fcff')
    .attr('flood-opacity', 1)
    .attr('result', 'flood1');

  filter.append('feComposite')
    .attr('in', 'flood1')
    .attr('in2', 'blur1')
    .attr('operator', 'in')
    .attr('result', 'glow1');

  filter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 15)
    .attr('result', 'blur2');

  filter.append('feFlood')
    .attr('flood-color', '#ebffff')
    .attr('flood-opacity', 1)
    .attr('result', 'flood2');

  filter.append('feComposite')
    .attr('in', 'flood2')
    .attr('in2', 'blur2')
    .attr('operator', 'in')
    .attr('result', 'glow2');

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'glow1');
  feMerge.append('feMergeNode').attr('in', 'glow2');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Base circle (background globe)
  this.svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', this.currentRadius)
    .attr('fill', CUSTOM_GLOBE_COLOR)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1)
    .style('filter', 'url(#glow)');

  // Overlay your transparent PNG texture
  this.svg.append('image')
    .attr('href', 'assets/images/transparent-globe.png')
    .attr('x', width / 2 - this.currentRadius)
    .attr('y', height / 2 - this.currentRadius)
    .attr('width', this.currentRadius * 2)
    .attr('height', this.currentRadius * 2)
    .style('pointer-events', 'none') // keep drag/zoom working
    .style('opacity', 0.9); // adjust transparency

  // Tooltip container (still available if you need later)
  d3.select(globeDiv).selectAll('.globe-tooltip').remove();
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'globe-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  // Setup drag/rotation interactions
  this.setupInteractions();
}
