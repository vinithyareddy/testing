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

  // Hover handler supported in three-globe
  (this.globe as any).onLabelHover((d: any) => {
    if (d) {
      const country = this.countriesList.find(c => c.code === d.code);
      if (country) {
        this.tooltipEl.nativeElement.innerHTML = `
          <b>${country.country}</b><br/>
          Unique Skills: ${country.uniqueSkills}<br/>
          Skill Supply (FTE): ${country.skillSupply}
        `;
        this.tooltipEl.nativeElement.style.display = 'block';
      } else {
        this.tooltipEl.nativeElement.style.display = 'none';
      }
    } else {
      this.tooltipEl.nativeElement.style.display = 'none';
    }
  });
}
