<!-- Tooltip container (initially hidden) -->
<div 
  id="globe-tooltip" 
  class="globe-tooltip" 
  [hidden]="!tooltipVisible" 
  [style.left.px]="tooltipX" 
  [style.top.px]="tooltipY">
  
  <div *ngIf="tooltipData">
    <img 
      *ngIf="tooltipData.code" 
      [src]="'https://flagcdn.com/16x12/' + tooltipData.code.toLowerCase() + '.png'" />
    <strong>{{ tooltipData.label }}</strong><br/>
    Average Cost: ${{ tooltipData.cost }}
  </div>
</div>


.globe-tooltip {
  position: absolute;
  pointer-events: none; // lets mouse pass through
  padding: 6px;
  font-size: 13px;
  background: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 3000;

  img {
    margin-right: 6px;
    vertical-align: middle;
  }
}


tooltipVisible = false;
tooltipX = 0;
tooltipY = 0;
tooltipData: { label: string; cost: number; code?: string } | null = null;


this.globe.onPolygonHover((d: any) => {
  if (!d) {
    this.tooltipVisible = false;
    return;
  }

  if (this.selectedView === 'By Country') {
    const entry = this.laborData.find(c => c.country === d.properties.name);
    if (entry) {
      this.tooltipData = { label: entry.country, cost: entry.cost, code: entry.code };
      this.tooltipVisible = true;
    }
  } else {
    const region = this.getRegion(d.properties.name);
    const regionCountries = this.laborData.filter(c => c.region === region);
    if (regionCountries.length > 0) {
      const total = regionCountries.reduce((s, c) => s + c.cost, 0);
      this.tooltipData = { label: region, cost: total };
      this.tooltipVisible = true;
    }
  }
});


this.globeContainer.nativeElement.addEventListener("mousemove", (event: MouseEvent) => {
  this.tooltipX = event.offsetX + 10;
  this.tooltipY = event.offsetY + 10;
});
