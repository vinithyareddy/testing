// Glow shadow around globe
const defs = this.svg.append('defs');
const filter = defs.append('filter').attr('id', 'glow');
filter.append('feGaussianBlur')
  .attr('stdDeviation', 15)
  .attr('result', 'coloredBlur');
const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'coloredBlur');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');


this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', CUSTOM_GLOBE_COLOR)
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1)
  .style('filter', 'url(#glow)');


  this.states = topojson.feature(
    data,
    data.objects['ne_50m_admin_1_states_provinces']   // ✅ update this key
  ) as unknown as FeatureCollection<Geometry, any>;

  
  this.svg.selectAll('.state')
  .data(this.states.features)
  .enter()
  .append('path')
  .attr('class', 'state')
  .attr('d', this.path)
  .attr('fill', 'transparent')
  .attr('stroke', '#999')         // thicker and clearer
  .attr('stroke-width', 0.4);


  if (this.isPointInFrontHemisphere(props.longitude || 0, props.latitude || 0)) {
    this.svg.append('text') ...
  }

  
  this.svg.append('text')
  .attr('class', 'state-label')
  .attr('x', x)
  .attr('y', y)
  .attr('text-anchor', 'middle')
  .style('font-size', this.isMobile ? '5px' : '7px')
  .style('fill', '#333')
  .style('stroke', 'white')       // makes text readable on dark background
  .style('stroke-width', '0.8px')
  .style('paint-order', 'stroke fill')
  .style('pointer-events', 'none')
  .text(label);
