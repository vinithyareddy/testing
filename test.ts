// --- UPDATE COUNTRY LABELS ---
this.svg.selectAll('.country-label')
  .attr("transform", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d); // geographic centroid
    const point = this.projection([lon, lat]);
    if (!point) return "translate(-9999,-9999)";
    return `translate(${point[0]},${point[1]})`;
  })
  .style("opacity", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d);
    const rotated = this.projection.rotate();
    const gDistance = d3.geoDistance([lon, lat], [-rotated[0], -rotated[1]]);

    // add buffer: fade between 80° and 100°
    if (gDistance < Math.PI / 2 - 0.2) {
      return 1; // fully visible
    } else if (gDistance > Math.PI / 2 + 0.2) {
      return 0; // fully hidden
    } else {
      // smooth fade in/out near horizon
      const t = (Math.PI / 2 + 0.2 - gDistance) / 0.4;
      return Math.max(0, Math.min(1, t));
    }
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
