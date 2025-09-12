this.globe.polygonsData(this.countries.features.map((f: any) => {
  f.userData = { feature: f };
  return f;
}))
.polygonAltitude(0.003)   // 🔑 make polygons slightly raised
.polygonCapColor((d: any) => {
  const countryName = d.properties.name;
  const entry = this.laborData.find(c => c.country === countryName);

  if (mode === 'region') {
    return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
  } else {
    return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
  }
})
.polygonSideColor(() => 'rgba(0,0,0,0.15)')   // semi-visible sides so raycaster hits
.polygonStrokeColor(() => mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION);
