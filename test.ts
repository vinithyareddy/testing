focusOnCountry(country: CountryCost) {
  if (!country) return;

  this.isRotating = false;
  this.currentRotation = [-country.lng, -country.lat];
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  // Remove any existing markers
  this.svg.selectAll('.country-marker').remove();

  // Get projected coordinates
  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];
  const pinSize = this.isMobile ? 24 : 30;

  const pinGroup = this.svg.append('g')
    .attr('class', 'country-marker')
    .attr('transform', `translate(${x}, ${y})`);

  // Shadow
  pinGroup.append('path')
    .attr('class', 'pin-shadow')
    .attr('d', this.buildPinPath(pinSize, 3, 3));

  // Main body
  pinGroup.append('path')
    .attr('class', 'pin-body')
    .attr('d', this.buildPinPath(pinSize));

  // Top cap
  pinGroup.append('circle')
    .attr('class', 'pin-cap')
    .attr('r', 3)
    .attr('cy', -pinSize * 1.2);

  // Inner circle
  pinGroup.append('circle')
    .attr('class', 'pin-inner')
    .attr('r', pinSize * 0.25)
    .attr('cy', -pinSize * 0.8);

  // Smooth appearance
  pinGroup
    .style('opacity', 0)
    .style('transform', 'scale(0.5)')
    .transition()
    .duration(400)
    .style('opacity', 1)
    .style('transform', 'scale(1)');

  // Auto-remove after 3s
  setTimeout(() => {
    pinGroup.transition()
      .duration(600)
      .style('opacity', 0)
      .on('end', () => pinGroup.remove());
    this.isRotating = true;
  }, 3000);
}

// Helper to build pin path
private buildPinPath(size: number, dx = 0, dy = 0): string {
  return `
    M ${dx} ${dy}
    C ${-size/2 + dx} ${-size/2 + dy} 
      ${-size/2 + dx} ${-size + dy} 
      ${dx} ${-size * 1.2 + dy}
    C ${size/2 + dx} ${-size + dy} 
      ${size/2 + dx} ${-size/2 + dy} 
      ${dx} ${dy}
    Z
  `;
}


.country-marker {
  .pin-shadow {
    fill: #000;
    opacity: 0.2;
  }

  .pin-body {
    fill: #1a73e8;
    stroke: #fff;
    stroke-width: 2;
  }

  .pin-cap {
    fill: #1a73e8;
    stroke: #fff;
    stroke-width: 2;
  }

  .pin-inner {
    fill: #fff;
  }
}
