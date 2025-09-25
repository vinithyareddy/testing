// --- Land overlay (transparent PNG clipped to circle) ---
this.svg.append('g')
  .attr('class', 'globe-map')
  .append('image')
  .attr('href', 'assets/images/transparent-globe.png')
  .attr('x', width / 2 - this.currentRadius)
  .attr('y', height / 2 - this.currentRadius)
  .attr('width', this.currentRadius * 2)
  .attr('height', this.currentRadius * 2)
  .attr(
    'clip-path',
    `circle(${this.currentRadius}px at ${width / 2}px ${height / 2}px)`
  )
  .attr('preserveAspectRatio', 'xMidYMid slice');


  // rotate PNG background with same longitude
this.svg.select('.globe-map image')
.attr(
  'transform',
  `rotate(${this.currentRotation[0]}, ${this.svg.node().getBoundingClientRect().width / 2}, ${this.svg.node().getBoundingClientRect().height / 2})`
);


.attr('fill', 'transparent') // keep invisible



// resize PNG image
this.svg.select('.globe-map image')
  .attr('x', width / 2 - this.currentRadius * this.currentZoom)
  .attr('y', height / 2 - this.currentRadius * this.currentZoom)
  .attr('width', this.currentRadius * 2 * this.currentZoom)
  .attr('height', this.currentRadius * 2 * this.currentZoom)
  .attr(
    'clip-path',
    `circle(${this.currentRadius * this.currentZoom}px at ${width / 2}px ${height / 2}px)`
  );
