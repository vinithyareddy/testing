// Update your ocean-related methods to work with your existing oceans.json:

private drawOceans() {
  if (!this.oceans) return;

  this.svg.selectAll('.ocean').remove();
  this.svg.selectAll('.ocean-label').remove();
  this.svg.selectAll('.ocean-label-shadow').remove();

  // Draw ocean areas (polygons from your JSON)
  this.svg.selectAll('.ocean')
    .data(this.oceans.features)
    .enter()
    .append('path')
    .attr('class', 'ocean')
    .attr('d', this.path)
    .attr('fill', 'rgba(163, 213, 245, 0.2)') // Very transparent
    .attr('stroke', 'none')
    .style('pointer-events', 'none');

  // Since your JSON doesn't have ocean names, we'll add them manually
  // based on the typical order/position of ocean features
  const oceanNames = [
    'Pacific Ocean',
    'Atlantic Ocean', 
    'Indian Ocean',
    'Arctic Ocean',
    'Southern Ocean'
  ];

  // Draw ocean labels at the centroid of each ocean polygon
  this.oceans.features.forEach((feature: any, index: number) => {
    const centroid = d3.geoCentroid(feature);
    const projected = this.projection(centroid);
    
    if (!projected) return;
    
    // Check if this ocean area is visible
    const isVisible = this.isPointVisible(centroid);
    if (!isVisible) return;

    const [x, y] = projected;
    
    // Use the ocean name from our array, or a default if index is out of bounds
    const oceanName = oceanNames[index] || `Ocean ${index + 1}`;

    // Add shadow for better readability
    this.svg.append('text')
      .attr('class', 'ocean-label-shadow')
      .attr('x', x + 1)
      .attr('y', y + 1)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', 'rgba(0,0,0,0.4)')
      .style('pointer-events', 'none')
      .text(oceanName);

    // Add main label
    this.svg.append('text')
      .attr('class', 'ocean-label')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', '#1a5490')
      .style('stroke', 'rgba(255,255,255,0.9)')
      .style('stroke-width', '2px')
      .style('paint-order', 'stroke fill')
      .style('pointer-events', 'none')
      .style('opacity', 0.8)
      .text(oceanName);
  });
}

// Update the updateCountries method to properly handle oceans
private updateCountries() {
  this.svg.selectAll('.country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d));

  this.svg.select('circle')
    .attr('r', this.currentRadius * this.currentZoom);

  // Update ocean areas if they exist
  if (this.oceans) {
    this.svg.selectAll('.ocean')
      .attr('d', this.path);
    
    // Redraw ocean labels with updated positions
    this.drawOceans();
  }

  // Update equator
  this.svg.selectAll('.equator')
    .attr('d', this.path);

  this.updateCountryLabels();
}

// Make sure your loadData method loads oceans correctly
private loadData() {
  this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
    this.countriesList = data.countries.map((c: any) => ({
      country: c.name,
      code: c.code,
      region: c.region,
      uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
      skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
      lat: c.lat,
      lng: c.lng,
      position: this.latLngToVector3(c.lat, c.lng, this.currentRadius)
    }));

    const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
    const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
    this.countryColorScale = d3.scaleLinear<string>()
      .domain([minSkills, (minSkills + maxSkills) * 0.25, (minSkills + maxSkills) * 0.5, (minSkills + maxSkills) * 0.75, maxSkills])
      .range([
        '#f5f0e4',
        '#dbd5c8ff',
        '#bed8ceff',
        '#99c5b4ff',
        '#87c3ab'
      ]);

    this.filteredList = [...this.countriesList];
    this.initializeCountryLabels();
    this.drawCountries();
    this.drawEquator();
    this.startRotation();
  });

  // Load states/provinces
  this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
    this.states = topojson.feature(
      data,
      data.objects.ne_50m_admin_1_states_provinces
    ) as unknown as FeatureCollection<Geometry, any>;
    this.initializeStateLabels();
    this.drawStates();
  });

  // Load oceans - this should work with your existing file structure
  this.http.get<any>('assets/json/oceans.json').subscribe(data => {
    // Check if data needs to be processed with topojson or if it's already a FeatureCollection
    if (data.type === 'FeatureCollection') {
      // Direct GeoJSON FeatureCollection
      this.oceans = data as FeatureCollection<Geometry, any>;
    } else if (data.objects) {
      // TopoJSON format
      this.oceans = topojson.feature(
        data,
        data.objects.oceans || data.objects[Object.keys(data.objects)[0]]
      ) as unknown as FeatureCollection<Geometry, any>;
    }
    
    this.drawOceans();
  }, error => {
    console.warn('Could not load oceans.json:', error);
    // Fallback to simple ocean labels if file fails to load
    this.drawSimpleOceanLabels();
  });
}

// Fallback method for simple ocean labels if JSON fails
private drawSimpleOceanLabels() {
  const oceanData = [
    { name: 'Pacific Ocean', lat: 0, lng: -160 },
    { name: 'Atlantic Ocean', lat: 30, lng: -30 },
    { name: 'Indian Ocean', lat: -20, lng: 80 },
    { name: 'Arctic Ocean', lat: 80, lng: 0 },
    { name: 'Southern Ocean', lat: -60, lng: 0 }
  ];

  oceanData.forEach(ocean => {
    const projected = this.projection([ocean.lng, ocean.lat]);
    if (!projected) return;

    const isVisible = this.isPointVisible([ocean.lng, ocean.lat]);
    if (!isVisible) return;

    const [x, y] = projected;

    this.svg.append('text')
      .attr('class', 'ocean-label')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a5490')
      .style('stroke', 'white')
      .style('stroke-width', '2px')
      .style('paint-order', 'stroke fill')
      .text(ocean.name);
  });
}