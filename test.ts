if (typeof (this.globe as any).labelsData === 'function') {
  this.globe
    .labelsData(labelData)
    .labelText((d: any) => d.code)
    .labelLat((d: any) => d.lat)
    .labelLng((d: any) => d.lng)
    .labelAltitude(0.01)
    .labelSize(0.45)
    .labelDotRadius(0.12)
    .labelColor(() => 'rgba(0,0,0,0.8)')
    .labelResolution(2);

  // Wait until labels are ready and attach userData
  setTimeout(() => {
    const labelObjs = (this.globe as any).labelsData();
    const meshes = (this.globe as any).scene().children;
    meshes.forEach((obj: any, i: number) => {
      if (obj.type === 'Sprite' && labelObjs[i]) {
        obj.userData = { code: labelObjs[i].code };
      }
    });
  }, 1000);
}


for (const obj of intersects) {
  if (obj.object && obj.object.userData && obj.object.userData.code) {
    const country = this.countriesList.find(c => c.code === obj.object.userData.code);
    if (country && this.tooltipEl) {
      this.tooltipEl.nativeElement.innerHTML = `
        <b>${country.country}</b><br/>
        Unique Skills: ${country.uniqueSkills}<br/>
        Skill Supply (FTE): ${country.skillSupply}
      `;
      this.tooltipEl.nativeElement.style.display = 'block';
      found = true;
      break;
    }
  }
}
