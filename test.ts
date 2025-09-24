private drawEquator() {
  // A circle around the globe at latitude 0 (equator)
  const equator = d3.geoCircle()
    .center([0, 0])     // start at [lon=0, lat=0]
    .radius(90)         // equator is 90° from the pole
    .precision(100);    // smoother curve

  this.svg.selectAll('.equator').remove();

  this.svg.append('path')
    .datum(equator())
    .attr('class', 'equator')
    .attr('d', this.path)
    .attr('fill', 'none')
    .attr('stroke', 'red')     // test color to confirm
    .attr('stroke-width', 1.2)
    .attr('stroke-dasharray', '4,2')
    .style('pointer-events', 'none');
}
