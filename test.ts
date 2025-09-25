// Base teal ocean circle
this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', CUSTOM_GLOBE_COLOR)
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1)
  .style('filter', 'url(#glow)');

// Overlay transparent globe texture (land only)
this.svg.append('image')
  .attr('href', 'assets/images/transparent-globe.png')
  .attr('x', width / 2 - this.currentRadius)
  .attr('y', height / 2 - this.currentRadius)
  .attr('width', this.currentRadius * 2)
  .attr('height', this.currentRadius * 2)
  .attr('preserveAspectRatio', 'xMidYMid slice')
  .attr('clip-path', `circle(${this.currentRadius}px at ${width/2}px ${height/2}px)`);


  private drawCountries() {
    // remove old filled countries
    this.svg.selectAll('.country').remove();
  
    // Add invisible paths just for interaction (tooltip/highlight)
    this.svg.selectAll('.country-hover')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'country-hover')
      .attr('d', this.path)
      .attr('fill', 'transparent')
      .attr('stroke', 'none')
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        this.isRotating = false;
        this.showTooltip(event, d);
      })
      .on('mousemove', (event: any) => this.moveTooltip(event))
      .on('mouseout', () => {
        if (!this.isDragging) {
          this.isRotating = true;
        }
        this.hideTooltip();
      });
  
    this.updateCountryLabels();
  }

  
  // update teal circle
this.svg.select('circle')
.attr('cx', width / 2)
.attr('cy', height / 2)
.attr('r', this.currentRadius * this.currentZoom);

// update overlay image
this.svg.select('image')
.attr('x', width/2 - this.currentRadius * this.currentZoom)
.attr('y', height/2 - this.currentRadius * this.currentZoom)
.attr('width', this.currentRadius * 2 * this.currentZoom)
.attr('height', this.currentRadius * 2 * this.currentZoom)
.attr('clip-path', `circle(${this.currentRadius * this.currentZoom}px at ${width/2}px ${height/2}px)`);
