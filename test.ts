const earth = new THREE.Mesh(
  new THREE.SphereGeometry(RADIUS, 75, 75),
  new THREE.MeshPhongMaterial({
    color: new THREE.Color(DEFAULT_GLOBE_COLOR), // base fill
    shininess: 1
  })
);
scene.add(earth);


this.globe
  .polygonsData(this.countries.features)
  .polygonAltitude(() => 0)   // sit directly on sphere
  .polygonCapColor((d: any) => {
    const countryName = d.properties.name;
    const entry = this.laborData.find(c => c.country === countryName);

    if (mode === 'region') {
      return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
    } else {
      return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
    }
  })
  .polygonSideColor(() => 'rgba(0,0,0,0)')  // transparent sides
  .polygonStrokeColor(() => mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION);
