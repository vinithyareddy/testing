private globe: any;   // reference to the globe
private countryColorScale = d3.scaleLinear<string>()
  .domain([0, d3.max(this.laborData, d => d.cost) || 100])
  .range(["#cce5ff", "#003366"]); // light → dark


  this.globe = new Globe().showGlobe(true).showGraticules(false);
this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') }));

// default = region coloring
this.applyRegionColors(countries);

scene.add(this.globe);


private getRegion(countryName: string): string {
  const northAmerica = ['United States of America', 'Canada', 'Mexico', ...];
  const southAmerica = ['Brazil', 'Argentina', 'Colombia', ...];

  if (northAmerica.includes(countryName)) return 'North America';
  if (southAmerica.includes(countryName)) return 'South America';
  return 'Other';
}

private applyRegionColors(countries: any) {
  this.globe.polygonsData(countries.features)
    .polygonCapColor((d: any) => {
      const region = this.getRegion(d.properties.name);
      return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
    })
    .polygonSideColor(() => '#84c9f6');
}

private applyCountryColors(countries: any) {
  this.globe.polygonsData(countries.features)
    .polygonCapColor((d: any) => {
      const entry = this.laborData.find(c => c.country === d.properties.name);
      if (entry) {
        return this.countryColorScale(entry.cost); // cost-based color
      }
      return "#e0e0e0"; // fallback gray if no data
    })
    .polygonSideColor(() => '#84c9f6');
}


setView(view: string) {
  this.selectedView = view;
  if (view === 'By Region') {
    this.showRegionData();
    this.applyRegionColors(worldData as any); // region colors
  } else {
    this.showCountryData();
    this.applyCountryColors(worldData as any); // country colors
  }
}
