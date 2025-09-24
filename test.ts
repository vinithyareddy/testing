private drawEquator() {
  // Create equator as a great circle at latitude 0
  const equatorCoords = [];
  for (let lng = -180; lng <= 180; lng += 2) {
    equatorCoords.push([lng, 0]); // longitude varies, latitude is 0 (equator)
  }

  // Create a GeoJSON LineString for the equator
  const equatorGeoJSON = {
    type: "LineString",
    coordinates: equatorCoords
  };

  this.svg.selectAll('.equator').remove();

  this.svg.append('path')
    .datum(equatorGeoJSON)
    .attr('class', 'equator')
    .attr('d', this.path)
    .attr('fill', 'none')
    .attr('stroke', '#ff6b6b')     // Orange-red color for visibility
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,3')
    .style('pointer-events', 'none')
    .style('opacity', 0.8);
}