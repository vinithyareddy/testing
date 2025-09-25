private initializeGlobe() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  this.currentRadius = this.getResponsiveRadius();

  // Setup projection
  this.projection = d3.geoOrthographic()
    .scale(this.currentRadius)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  this.path = d3.geoPath().projection(this.projection);

  // Remove old globe
  d3.select(globeDiv).selectAll('svg').remove();

  this.svg = d3.select(globeDiv)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Base circle (ocean fill)
  this.svg.append('path')
    .datum({ type: 'Sphere' })
    .attr('d', this.path)
    .attr('fill', CUSTOM_GLOBE_COLOR)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1);

  // 🌍 Add graticule lines (replaces transparent-globe.png)
  const graticule = d3.geoGraticule10();

  this.svg.append('path')
    .datum(graticule)
    .attr('d', this.path)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.6)') // white transparent lines
    .attr('stroke-width', 0.6);

  // Optional: Equator line
  this.svg.append('path')
    .datum({ type: "LineString", coordinates: d3.range(-180, 181, 1).map(lon => [lon, 0]) })
    .attr('d', this.path)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 1)
    .attr('fill', 'none')
    .attr('opacity', 0.7);

  // Tooltip container
  d3.select(globeDiv).selectAll('.globe-tooltip').remove();
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'globe-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  // Enable drag/rotation
  this.setupInteractions();
}
