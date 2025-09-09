globe
  .polygonsData(countries.features)
  .polygonCapColor((d: any) => {
    const region = getRegion(d.properties.name);
    return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
  })
  .polygonSideColor(() => 'rgba(0,0,0,0.2)')
  .polygonStrokeColor(() => '#111')
  // ✅ Tooltip when hovering
  .polygonLabel((d: any) => {
    const countryName = d.properties.name;
    const match = this.laborData.find(c => c.country === countryName);

    if (match) {
      return `
        <div style="padding:6px 10px; font-size:13px; color:#000; text-align:left; background:#fff; border-radius:4px;">
          <div style="font-weight:bold; margin-bottom:4px;">
            <img src="https://flagcdn.com/24x18/${match.code.toLowerCase()}.png" 
                 style="width:20px; margin-right:6px; vertical-align:middle;" />
            ${match.country}
          </div>
          <div>Average Cost <b>$${match.cost}</b></div>
        </div>
      `;
    }

    return `<div style="padding:6px 10px; font-size:13px; color:#000; background:#fff; border-radius:4px;">${countryName}</div>`;
  });
