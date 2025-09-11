this.globe
  .labelsData(labelData)
  .labelText((d: any) => d.code)
  .labelLat((d: any) => d.lat)
  .labelLng((d: any) => d.lng)
  .labelAltitude(0.012)
  .labelSize(0.95)
  .labelDotRadius(0.16)
  .labelColor(() => 'rgba(0,0,0,0.9)')
  .labelResolution(2)
  .labelLabel((d: any) => {
    const c = this.countriesList.find(x => x.code === d.code);
    if (!c) return ''; // no tooltip if no data for that country
    return `
      <div style="padding:6px 8px;">
        <b>${c.country}</b><br/>
        Unique Skills: ${c.uniqueSkills}<br/>
        Skill Supply: ${c.skillSupply}
      </div>
    `;
  });
