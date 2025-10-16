focusOnCountry(country: CountrySkill) {
    if (!country) return;
    this.isRotating = false;
  
    const targetRotation: [number, number, number] = [-country.lng, -country.lat, 0];
    this.currentRotation = targetRotation;
    this.projection.rotate(this.currentRotation);
    this.updateCountries();
  
    this.svg.selectAll('.country-highlight').remove();
    const feature = this.countries.features.find(
      (f: any) => f.properties.name === country.country
    );
  
    if (!feature) return;
  
    const highlight = this.svg
      .append('path')
      .datum(feature)
      .attr('class', 'country-highlight')
      .attr('d', this.path)
      .attr('fill', 'none')
      .attr('stroke', '#ff4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8,4')
      .style('opacity', 0);
  
    highlight.transition().duration(400).style('opacity', 1);
  
    const centroid = d3.geoCentroid(feature);
    const projected = this.projection(centroid);
    if (projected) {
      const fakeEvent = {
        clientX: projected[0] + this.globeContainer.nativeElement.getBoundingClientRect().left,
        clientY: projected[1] + this.globeContainer.nativeElement.getBoundingClientRect().top
      } as MouseEvent;
      this.showTooltip(fakeEvent, feature);
    }
  
    setTimeout(() => {
      this.hideTooltip();
      highlight.transition().duration(600).style('opacity', 0).remove();
      this.isRotating = true;
    }, 3000);
  }
  