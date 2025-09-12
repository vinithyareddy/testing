this.globe.polygonsData(this.countries.features)
  .polygonCapColor((d: any) => {
    const countryName = d.properties.name;
    const entry = this.laborData.find(c => c.country.toLowerCase() === countryName.toLowerCase());
    if (!entry) return '#ccc';

    if (this.selectedView === 'By Region') {
      return REGION_COLORS[entry.region] || REGION_COLORS['Other'];
    } else {
      return this.countryColorScale(entry.cost);
    }
  })
  .polygonSideColor(() => DEFAULT_GLOBE_COLOR)
  .polygonStrokeColor(() => STROKE_COLOR_COUNTRY);
