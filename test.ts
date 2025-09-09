globe
  .polygonsData(countries.features)
  .polygonCapColor((d: any) => {
    const region = getRegion(d.properties.name);
    return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
  })
  .polygonSideColor(() => '#84c9f6')
  .polygonLabel((d: any) => {
    const country = this.laborData.find(c => c.country === d.properties.name);
    return country
      ? `<div><b>${country.country}</b><br/>Average Cost: $${country.cost}</div>`
      : `<div><b>${d.properties.name}</b></div>`;
  });
