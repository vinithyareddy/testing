private getTooltipContent(d: any, mode: 'region' | 'country'): string {
  if (mode === 'region') {
    const regionName = this.getRegion(d.properties.name);
    if (!regionName || regionName === REGION_OTHER) return '';

    // Calculate total cost for that region on the fly
    const regionCountries = this.laborData.filter(c => c.region === regionName);
    const total = regionCountries.reduce((s, c) => s + c.cost, 0);

    return `
      <div style="
        padding:6px;
        font-size:13px;
        background:#fff;
        color:#000;
        border:1px solid #ccc;
        border-radius:4px;">
        <strong>${regionName}</strong><br/>
        Average Cost: $${total}
      </div>
    `;
  } else {
    const entry = this.laborData.find(c => c.country === d.properties.name);
    if (!entry) return '';

    return `
      <div style="
        padding:6px;
        font-size:13px;
        background:#fff;
        color:#000;
        border:1px solid #ccc;
        border-radius:4px;">
        <img src="https://flagcdn.com/16x12/${entry.code.toLowerCase()}.png"
             style="margin-right:6px; vertical-align:middle;" />
        <strong>${entry.country}</strong><br/>
        Average Cost: $${entry.cost}
      </div>
    `;
  }
}


this.globe.polygonsData(this.countries.features)
  .polygonCapColor(...)
  .polygonSideColor(...)
  .polygonStrokeColor(...)
  .polygonLabel((d: any) => this.getTooltipContent(d, mode)); // always returns string


  .polygonLabel((d: any) => this.getTooltipContent(d, mode));
