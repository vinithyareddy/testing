private applyColors(mode: 'region' | 'country') {
  if (!this.countries) return;

  this.globe
    .polygonsData(this.countries.features)
    .polygonCapColor((d: any) => {
      const countryName = d.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);

      if (mode === 'region') {
        return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : FALLBACK_COLOR;
      } else {
        return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }
    })
    .polygonSideColor(() => 'rgba(0,0,0,0)')   // hide 3D extrusion sides
    .polygonStrokeColor(() => '#ffffff')       // thin border so shapes are visible
    .polygonAltitude(0);                       // keep perfectly flat on the sphere
}
