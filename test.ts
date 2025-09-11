// keep polygons invisible, but enable tooltip on hover
this.globe
  .polygonsData(this.countries.features)
  .polygonCapColor(() => 'rgba(0,0,0,0)')
  .polygonSideColor(() => 'rgba(0,0,0,0)')
  .polygonStrokeColor(() => 'rgba(0,0,0,0)')
  .polygonAltitude(0)
  .polygonLabel((f: any) => {
    // map TopoJSON country name -> ISO code -> your data
    const name = f?.properties?.name as string;
    const code = this.nameToCode.get(name);
    if (!code) return '';                           // no code = no tooltip
    const c = this.countriesList.find(x => x.code === code);
    if (!c) return '';                               // show tooltip only if you have data

    return `
      <div style="
        background:#fff;padding:8px 12px;border-radius:6px;
        box-shadow:0 2px 10px rgba(0,0,0,.2);font-size:13px;line-height:1.4;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <img src="https://flagcdn.com/24x18/${code.toLowerCase()}.png" />
          <b>${c.country}</b>
        </div>
        <div>Unique Skills: ${c.uniqueSkills}</div>
        <div>Skill Supply (FTE): ${c.skillSupply}</div>
      </div>
    `;
  })
  .onPolygonHover((f: any) => {
    // cursor feedback
    (renderer.domElement as HTMLCanvasElement).style.cursor = f ? 'pointer' : '';
  })
  .polygonsTransitionDuration(0); // snappy


  :host ::ng-deep .globe-tooltip {
    background: #fff !important;
    padding: 8px 12px !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,.2) !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
  }
  