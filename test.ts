private createIconDataUrl(
  color: string = '#1a73e8',
  size: number = 64
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = size;
  canvas.height = size;

  // Draw the FA icon
  ctx.font = `900 ${size - 12}px "Font Awesome 6 Pro"`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\uf3c5', size / 2, size / 2); // 🔑 location-dot

  return canvas.toDataURL('image/png'); // return image as data URL
}


focusOnCountry(country: CountryCost) {
  if (!country) return;

  this.isRotating = false;

  const targetRotation = [-country.lng, -country.lat];
  this.currentRotation = targetRotation;
  this.projection.rotate(this.currentRotation);
  this.updateCountries();

  this.svg.selectAll('.country-marker').remove();

  const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];

  // Get FA icon as data URL
  const iconUrl = this.createIconDataUrl('#1a73e8', this.isMobile ? 32 : 48);

  // Append as <image> in SVG
  const pin = this.svg.append('image')
    .attr('class', 'country-marker')
    .attr('x', x - 12)  // offset so it centers
    .attr('y', y - 24)  // adjust to look like a pin
    .attr('width', this.isMobile ? 18 : 24)
    .attr('height', this.isMobile ? 18 : 24)
    .attr('href', iconUrl);

  // Fade-in animation
  pin.style('opacity', 0)
    .transition().duration(400).style('opacity', 1);

  // Auto remove after 3s
  setTimeout(() => {
    pin.transition().duration(600).style('opacity', 0).remove();
    this.isRotating = true;
  }, 3000);
}
