globe
  .polygonsData(countries.features)
  .polygonCapColor((d: any) => {
    const countryName = d.properties.name;

    // Check laborData first
    const entry = this.laborData.find(c => c.country === countryName);
    if (entry) {
      return this.REGION_COLORS[entry.region] ?? '#ffffff';
    }

    // Default → white
    return '#ffffff';
  })
  .polygonSideColor(() => 'rgba(0,0,0,0.1)')
  .polygonStrokeColor(() => '#10283b');
