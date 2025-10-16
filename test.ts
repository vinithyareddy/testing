private drawCountryLabels() {
    this.svg.selectAll('.country-label').remove();
    const labelData = this.countries.features.map((f: any) => ({
      name: f.properties.name,
      centroid: d3.geoCentroid(f)
    }));
  
    labelData.forEach(d => {
      const projected = this.projection(d.centroid);
      if (!projected) return;
      this.svg
        .append('text')
        .attr('class', 'country-label')
        .attr('x', projected[0])
        .attr('y', projected[1])
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .style('stroke', '#fff')
        .style('stroke-width', '0.5px')
        .style('paint-order', 'stroke fill')
        .text(d.name);
    });
  }

  
  this.drawOceans();
this.drawStates();
this.updateCountries();
this.drawEquator();
this.drawCountryLabels();
this.startRotationLoop();
