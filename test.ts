// Remove old labels before redrawing
this.svg.selectAll(".country-label").remove();

// Add labels for each country
this.svg.selectAll(".country-label")
  .data(this.countries.features)
  .enter()
  .append("text")
  .attr("class", "country-label")
  .attr("transform", (d: any) => {
    const centroid = this.path.centroid(d);  // get center of country
    return `translate(${centroid})`;
  })
  .text((d: any) => d.properties.name) // country name from TopoJSON
  .attr("text-anchor", "middle")
  .style("font-size", "9px")
  .style("fill", "#000")
  .style("pointer-events", "none"); // so tooltips still work


  .country-label {
    font-family: Arial, sans-serif;
    font-weight: 500;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.8); // makes text readable on map
  }
  