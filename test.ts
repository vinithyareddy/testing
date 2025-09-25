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

  // Clear old globe
  d3.select(globeDiv).selectAll('svg').remove();

  this.svg = d3.select(globeDiv)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Define pattern with your PNG
  const defs = this.svg.append("defs");

  defs.append("pattern")
    .attr("id", "globeTexture")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", width)
    .attr("height", height)
    .append("image")
    .attr("xlink:href", "assets/images/transparent-globe.png")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMidYMid slice");

  // Draw the sphere, filled with the PNG
  this.svg.append("path")
    .datum({ type: "Sphere" })
    .attr("d", this.path)
    .attr("fill", "url(#globeTexture)")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);

  // Tooltip container
  d3.select(globeDiv).selectAll('.globe-tooltip').remove();
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'globe-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  // Keep interactions working
  this.setupInteractions();
}
