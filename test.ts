private getTooltipContent(d: any, mode: 'region' | 'country'): string {
  if (mode === 'region') {
    const regionName = this.getRegion(d.properties.name);
    const regionData = this.regionGroups.find(r => r.region === regionName);
    if (regionData) {
      return `
        <div style="padding:6px; font-size:13px;">
          <strong>${regionData.region}</strong><br/>
          Average Cost: $${regionData.total}
        </div>
      `;
    }
  } else {
    const entry = this.laborData.find(c => c.country === d.properties.name);
    if (entry) {
      return `
        <div style="padding:6px; font-size:13px;">
          <img src="https://flagcdn.com/16x12/${entry.code.toLowerCase()}.png" 
               style="margin-right:6px; vertical-align:middle;" />
          <strong>${entry.country}</strong><br/>
          Average Cost: $${entry.cost}
        </div>
      `;
    }
  }
  return '';
}


private applyColors(mode: 'region' | 'country') {
  if (!this.countries) return;

  this.globe.polygonsData(this.countries.features)
    .polygonCapColor((d: any) => {
      if (mode === 'region') {
        const region = this.getRegion(d.properties.name);
        return REGION_COLORS[region] || REGION_COLORS[REGION_OTHER];
      } else {
        const entry = this.laborData.find(c => c.country === d.properties.name);
        return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }
    })
    .polygonSideColor(() => DEFAULT_GLOBE_COLOR)
    .polygonStrokeColor(() => mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION)
    // ✅ Tooltip
    .polygonLabel((d: any) => this.getTooltipContent(d, mode));
}
