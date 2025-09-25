private initializeGlobe() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  this.currentRadius = this.getResponsiveRadius();

  this.projection = d3.geoOrthographic()
    .scale(this.currentRadius)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  this.projection.rotate([0, 0]);
  this.path = d3.geoPath().projection(this.projection);

  // remove old SVG
  d3.select(globeDiv).selectAll('svg').remove();

  this.svg = d3.select(globeDiv)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // --- defs for PNG texture ---
  const defs = this.svg.append('defs');
  defs.append('pattern')
    .attr('id', 'globe-texture')
    .attr('patternUnits', 'objectBoundingBox')
    .attr('width', 1)
    .attr('height', 1)
    .append('image')
    .attr('href', 'assets/images/transparent-globe.png')
    .attr('preserveAspectRatio', 'xMidYMid slice')
    .attr('width', width)
    .attr('height', height);

  // --- Base teal ocean circle ---
  this.svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', this.currentRadius)
    .attr('fill', CUSTOM_GLOBE_COLOR)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1);

  // --- Land overlay (from PNG texture) ---
  this.svg.append('path')
    .datum({ type: 'Sphere' })
    .attr('d', this.path)
    .attr('fill', 'url(#globe-texture)')
    .attr('stroke', 'none');

  // keep tooltip
  d3.select(globeDiv).selectAll('.globe-tooltip').remove();
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'globe-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  this.setupInteractions();
}




private handleResize() {
  if (!this.svg || !this.globeContainer) return;

  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  this.currentRadius = this.getResponsiveRadius();

  this.projection
    .scale(this.currentRadius * this.currentZoom)
    .translate([width / 2, height / 2]);

  this.svg.attr('viewBox', `0 0 ${width} ${height}`);

  // resize base circle
  this.svg.select('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', this.currentRadius * this.currentZoom);

  // resize texture pattern
  this.svg.select('#globe-texture image')
    .attr('width', width)
    .attr('height', height);

  // redraw globe path with updated projection
  this.svg.select('path')
    .attr('d', this.path);

  this.updateCountries(); // keep invisible paths for tooltips
  this.updateStates();
}
