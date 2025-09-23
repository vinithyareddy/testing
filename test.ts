private drawCountries() {
  // remove old country paths
  this.svg.selectAll('.country').remove();

  // draw countries
  this.svg.selectAll('.country')
    .data(this.countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d))
    .attr('stroke', this.selectedView === 'By Country' ? STROKE_COLOR_COUNTRY : 'none')
    .attr('stroke-width', 0.5)
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

  // ✅ NEW CODE FOR LABELS STARTS HERE

  // remove old labels first
  this.svg.selectAll(".country-label").remove();

  this.svg.selectAll(".country-label")
    .data(this.countries.features)
    .enter()
    .append("text")
    .attr("class", "country-label")
    .attr("transform", (d: any) => {
      const centroid: [number, number] = this.path.centroid(d) || [0, 0];
      return `translate(${centroid[0]},${centroid[1]})`;
    })
    .text((d: any) => d.properties?.name || "")
    .attr("text-anchor", "middle")
    .style("font-size", "9px")
    .style("fill", "#000")
    .style("pointer-events", "none");
}



  .country-label {
    font-family: Arial, sans-serif;
    font-weight: 500;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.8); // makes text readable on map
  }
  