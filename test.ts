private drawEquator() {
  const equator = d3.geoCircle()
    .center([0, 0])   // longitude 0, latitude 0
    .radius(90);      // 90° from the pole = equator

  this.svg.selectAll('.equator').remove();

  this.svg.append('path')
    .datum(equator())
    .attr('class', 'equator')
    .attr('d', this.path)
    .attr('fill', 'none')
    .attr('stroke', '#222')       // darker so it's visible
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,2')
    .style('pointer-events', 'none');
}
