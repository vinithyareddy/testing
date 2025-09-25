// --- defs for clipping ---
const defs = this.svg.append('defs');
defs.append('clipPath')
  .attr('id', 'globe-clip')
  .append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius);

// --- Base teal ocean circle ---
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', CUSTOM_GLOBE_COLOR)
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1);

// --- Land overlay (transparent PNG) ---
this.svg.append('image')
  .attr('class', 'globe-texture')
  .attr('href', 'assets/images/transparent-globe.png')
  .attr('x', width / 2 - this.currentRadius)
  .attr('y', height / 2 - this.currentRadius)
  .attr('width', this.currentRadius * 2)
  .attr('height', this.currentRadius * 2)
  .attr('clip-path', 'url(#globe-clip)')
  .attr('preserveAspectRatio', 'xMidYMid slice');


  // resize texture overlay
this.svg.select('.globe-texture')
.attr('x', width / 2 - this.currentRadius * this.currentZoom)
.attr('y', height / 2 - this.currentRadius * this.currentZoom)
.attr('width', this.currentRadius * 2 * this.currentZoom)
.attr('height', this.currentRadius * 2 * this.currentZoom);

this.svg.select('#globe-clip circle')
.attr('cx', width / 2)
.attr('cy', height / 2)
.attr('r', this.currentRadius * this.currentZoom);


private startRotation() {
  const rotate = () => {
    if (this.isRotating && !this.isDragging) {
      this.currentRotation[0] += ROTATION_SPEED;
      this.projection.rotate(this.currentRotation);

      this.updateCountries();
      this.updateStates();
      this.updateCountryLabels();
      this.updateStateLabels();

      // rotate PNG overlay with longitude
      const bbox = this.svg.node().getBoundingClientRect();
      this.svg.select('.globe-texture')
        .attr('transform', `rotate(${this.currentRotation[0]}, ${bbox.width/2}, ${bbox.height/2})`);
    }
    requestAnimationFrame(rotate);
  };
  rotate();
}
