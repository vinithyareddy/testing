private applyColors(mode: 'region' | 'country') {
  if (!this.countries) return;

  this.globe.polygonsData(this.countries.features)
    .polygonCapColor((d: any) => {
      const countryName = d.properties.name;

      if (mode === 'region') {
        // Find this country in our laborData
        const entry = this.laborData.find(c => c.country === countryName);
        if (entry) {
          // Use its region to color
          return REGION_COLORS[entry.region] || REGION_COLORS[REGION_OTHER];
        }
        return REGION_COLORS[REGION_OTHER];
      } 
      else { // country mode
        const entry = this.laborData.find(c => c.country === countryName);
        return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }
    })
    .polygonSideColor(() => DEFAULT_GLOBE_COLOR)
    .polygonStrokeColor(() => 
      mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION
    );
}
