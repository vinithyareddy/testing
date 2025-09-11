<div #tooltip class="globe-tooltip"></div>


.globe-tooltip {
  position: absolute;
  background: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  font-size: 13px;
  line-height: 1.4;
  pointer-events: none;
  display: none;
  z-index: 2000;
}

@ViewChild('tooltip', { static: true }) tooltipEl!: ElementRef<HTMLDivElement>;


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
    .labelResolution(2)
    .onHover((d: any) => {
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


renderer.domElement.addEventListener('mousemove', (event) => {
  this.tooltipEl.nativeElement.style.left = event.clientX + 15 + 'px';
  this.tooltipEl.nativeElement.style.top = event.clientY + 15 + 'px';
});
