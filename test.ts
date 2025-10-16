

this.drawOceans();
this.drawStates();
this.updateCountries();
this.drawEquator();
this.drawCountryLabels();
this.startRotationLoop();


private drawEquator() {
    const equatorCoords = [];
    for (let lng = -180; lng <= 180; lng += 2) equatorCoords.push([lng, 0]);
    const equator = { type: 'LineString', coordinates: equatorCoords };
    this.svg.selectAll('.equator').remove();
    this.svg
      .append('path')
      .datum(equator)
      .attr('class', 'equator')
      .attr('d', this.path)
      .attr('fill', 'none')
      .attr('stroke', '#7697a4')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')
      .style('opacity', 0.8)
      .style('pointer-events', 'none');
  }

  
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
  
  private drawOceans() {
    this.http.get<any>('assets/json/oceans.json').subscribe(data => {
      const oceans = data.features;
      this.svg.selectAll('.ocean-label').remove();
  
      oceans.forEach((feature: any) => {
        const coords = feature.geometry.coordinates;
        const projected = this.projection(coords);
        if (!projected) return;
  
        this.svg
          .append('text')
          .attr('class', 'ocean-label')
          .attr('x', projected[0])
          .attr('y', projected[1])
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#1a4b7a')
          .style('font-weight', '600')
          .style('opacity', 0.7)
          .text(feature.properties.name);
      });
    });
  }

  
  private drawStates() {
    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      const states = topojson.feature(
        data,
        data.objects.ne_50m_admin_1_states_provinces
      ) as FeatureCollection<Geometry, any>;
  
      this.svg.selectAll('.state').remove();
  
      this.svg
        .selectAll('.state')
        .data(states.features)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', this.path)
        .attr('fill', 'transparent')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 0.3)
        .style('pointer-events', 'none');
    });
  }

  
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
  