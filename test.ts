// --- UPDATE COUNTRY LABELS ---
this.svg.selectAll('.country-label')
  .attr("transform", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d); // geographic centroid
    const point = this.projection([lon, lat]);
    if (!point) return "translate(-9999,-9999)";
    return `translate(${point[0]},${point[1]})`;
  })
  .style("display", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d);
    const rotated = this.projection.rotate(); // current globe rotation
    const gDistance = d3.geoDistance([lon, lat], [-rotated[0], -rotated[1]]);
    return gDistance > Math.PI / 2 ? "none" : "block"; // hide if back side
  })
  .text((d: any) => {
    const area = d3.geoArea(d);
    if (area > 0.002) {
      return d.properties?.name; // always show large countries
    } else if (this.currentZoom > 1.8) {
      return d.properties?.name; // show small ones when zoomed in
    }
    return "";
  })
  .style("font-size", () => this.currentZoom > 1.5 ? "8px" : "9px");
