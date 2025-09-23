// --- UPDATE COUNTRY LABELS ---
this.svg.selectAll('.country-label')
  .attr("transform", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d);
    const point = this.projection([lon, lat]);
    if (!point) return "translate(-9999,-9999)";
    return `translate(${point[0]},${point[1]})`;
  })
  .style("opacity", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d);
    const rotated = this.projection.rotate();
    const gDistance = d3.geoDistance([lon, lat], [-rotated[0], -rotated[1]]);

    // fade out if near back
    return gDistance > Math.PI / 2 ? 0 : 1;
  })
  .style("font-size", (d: any) => {
    const [lon, lat] = d3.geoCentroid(d);
    const rotated = this.projection.rotate();
    const gDistance = d3.geoDistance([lon, lat], [-rotated[0], -rotated[1]]);

    // shrink near the edges to simulate wrapping on the globe
    if (gDistance < Math.PI / 4) return "10px";      // center → normal size
    if (gDistance < Math.PI / 2) return "7px";       // towards edge → smaller
    return "0px";                                    // back side → invisible
  })
  .text((d: any) => {
    const area = d3.geoArea(d);
    if (area > 0.002) {
      return d.properties?.name;
    } else if (this.currentZoom > 1.8) {
      return d.properties?.name;
    }
    return "";
  });
