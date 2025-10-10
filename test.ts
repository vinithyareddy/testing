.attr('fill', (d: any) => {
  const color = this.getCountryColor(d);
  // brighten the color for better visibility on blue glow background
  return d3.color(color)?.darker(-0.6)?.formatHex() || color;
})
.attr('stroke', STROKE_COLOR_COUNTRY)
.attr('stroke-width', 0.5)
.attr('fill-opacity', 0.95);
