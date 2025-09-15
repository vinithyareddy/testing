ngAfterViewInit() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  // ... your projection, path, svg setup ...

  // Tooltip setup
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'tooltip-card')   // use class for styling
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
    this.laborData = data.countries.map((c: any) => ({
      country: c.name,
      region: c.region,
      cost: c.cost ?? Math.floor(Math.random() * 2),
      code: c.code,
      lat: c.lat,
      lng: c.lng,
      position: this.latLngToVector3(c.lat, c.lng, RADIUS)
    }));

    const minCost = d3.min(this.laborData, d => d.cost) || 0;
    const maxCost = d3.max(this.laborData, d => d.cost) || 1;

    this.countryColorScale = d3.scaleLinear<string>()
      .domain([minCost, maxCost])
      .range(COUNTRY_COLOR_RANGE);

    this.showRegionData();
    this.drawCountries();
    this.startRotation();
  });

  // ... zoom + drag setup ...
}

private drawCountries() {
  this.svg.selectAll('.country').remove();

  this.svg.selectAll('.country')
    .data(this.countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', this.path)
    .attr('fill', (d: any) => this.getCountryColor(d))
    .attr('stroke', this.selectedView === 'By Country' ? STROKE_COLOR_COUNTRY : 'none')
    .attr('stroke-width', 0.5)
    .style('cursor', 'pointer')
    .on('mouseover', (event: any, d: any) => {
      const entry = this.laborData.find(c => c.country === d.properties.name);

      if (entry) {
        let tooltipContent = '';

        if (this.selectedView === 'By Region') {
          tooltipContent = `
            <div class="tooltip-row tooltip-header">${entry.region}</div>
            <div class="tooltip-row tooltip-body">
              <span>Average Cost</span>
              <span><b>$${entry.cost}</b></span>
            </div>
          `;
        } else {
          const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;
          tooltipContent = `
            <div class="tooltip-row tooltip-header">
              <img src="${flagUrl}" />
              <span>${entry.country}</span>
            </div>
            <div class="tooltip-row tooltip-body">
              <span>Average Cost</span>
              <span><b>$${entry.cost}</b></span>
            </div>
          `;
        }

        const rect = this.globeContainer.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.tooltip.html(tooltipContent)
          .style('left', (x + 15) + 'px')
          .style('top', (y + 15) + 'px')
          .style('display', 'block');
      }
    })
    .on('mousemove', (event: any) => {
      const rect = this.globeContainer.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.tooltip.style('left', (x + 15) + 'px')
        .style('top', (y + 15) + 'px');
    })
    .on('mouseout', () => {
      this.tooltip.style('display', 'none');
    });
}

.tooltip-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  width: 160px;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background: #fff;

  .tooltip-row {
    padding: 6px 10px;
  }

  .tooltip-header {
    background: #f5f5f5;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tooltip-body {
    background: #fff;
    display: flex;
    justify-content: space-between;
  }

  img {
    width: 20px;
    height: 14px;
    border: 1px solid #ccc;
  }
}
