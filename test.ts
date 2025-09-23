// --- COUNTRY LABELS ---
this.svg.selectAll(".country-label").remove();

this.svg.selectAll(".country-label")
  .data(this.countries.features)
  .enter()
  .append("text")
  .attr("class", "country-label")
  .attr("text-anchor", "middle")
  .style("font-size", "9px")
  .style("fill", "#000")
  .style("pointer-events", "none")
  .text((d: any) => {
    const area = d3.geoArea(d); // area of country
    // Show only larger countries at first
    return area > 0.002 ? d.properties?.name : "";
  });


  private updateCountries() {
    // Update country shapes
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));
  
    // Update globe circle
    this.svg.select('circle')
      .attr('r', this.currentRadius * this.currentZoom);
  
    // --- UPDATE COUNTRY LABELS ---
    this.svg.selectAll('.country-label')
      .attr("transform", (d: any) => {
        const centroid = this.path.centroid(d);
        return `translate(${centroid[0]},${centroid[1]})`;
      })
      .style("display", (d: any) => {
        // Hide labels on the back of the globe
        const [lon, lat] = d3.geoCentroid(d);
        const rotated = this.projection.rotate();
        const gDistance = d3.geoDistance([lon, lat], [-rotated[0], -rotated[1]]);
        return gDistance > Math.PI / 2 ? "none" : "block";
      })
      .text((d: any) => {
        const area = d3.geoArea(d);
        if (area > 0.002) {
          return d.properties?.name; // always show big ones
        } else if (this.currentZoom > 1.8) {
          return d.properties?.name; // show small ones only if zoomed in
        }
        return ""; // hide tiny islands at low zoom
      })
      .style("font-size", () => this.currentZoom > 1.5 ? "8px" : "9px");
  }

  
  .country-label {
    font-family: Arial, sans-serif;
    font-weight: 500;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.8); // keeps readable
  }
  