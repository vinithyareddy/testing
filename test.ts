// --- UPDATE COUNTRY LABELS ---
this.svg.selectAll('.country-label')
  .attr("transform", (d: any) => {
    // geographic centroid (lon, lat)
    const [lon, lat] = d3.geoCentroid(d);
    // project it to (x, y) on current globe
    const point = this.projection([lon, lat]);
    if (!point) return "translate(-9999,-9999)"; // hide safely if not valid
    return `translate(${point[0]},${point[1]})`;
  })
  .text((d: any) => {
    const area = d3.geoArea(d);
    if (area > 0.002) {
      return d.properties?.name; // big ones always visible
    } else if (this.currentZoom > 1.8) {
      return d.properties?.name; // show smaller only when zoomed in
    }
    return "";
  })
  .style("font-size", () => this.currentZoom > 1.5 ? "8px" : "9px");
