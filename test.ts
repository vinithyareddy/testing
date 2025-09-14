private applyColors(mode: 'region' | 'country') {
  if (!this.countries) return;

  this.globe.polygonsData(this.countries.features)
    .polygonCapColor((d: any) => {
      const countryName = d.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);

      if (mode === 'region') {
        return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
      } else {
        return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }
    })
    .polygonSideColor((d: any) => {
      // Make sides the same color as caps to create flat appearance
      const countryName = d.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);

      if (mode === 'region') {
        return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
      } else {
        return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }
    })
    .polygonStrokeColor(() => mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION)
    .polygonCapMaterial(() => new THREE.MeshBasicMaterial({ 
      transparent: false,
      side: THREE.DoubleSide 
    }))
    .polygonSideMaterial(() => new THREE.MeshBasicMaterial({ 
      transparent: true,
      opacity: 0
    }));
}