private applyColors(mode: 'region' | 'country') {
  if (!this.countries) return;

  this.globe
    .polygonsData(this.countries.features)
    .polygonCapMaterial((d: any) => {
      const countryName = d.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);

      // Pick color based on view
      const color =
        mode === 'region'
          ? (entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : FALLBACK_COLOR)
          : (entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR);

      // Custom material with polygonOffset to fix z-fighting
      return new THREE.MeshLambertMaterial({
        color,
        polygonOffset: true,
        polygonOffsetFactor: -1,   // push polygon forward slightly
        polygonOffsetUnits: -1
      });
    })
    .polygonSideColor(() => 'rgba(0,0,0,0)') // hide extrusion sides
    .polygonStrokeColor(() => mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION)
    .polygonAltitude(0); // keep flat (not extruded)
}
