if (this.selectedView === 'By Region') {
  const regionGroup = this.regionGroups.find(r => r.region === entry.region);

  let avgCost = 0;
  if (regionGroup && regionGroup.countries.length > 0) {
    avgCost = regionGroup.total / regionGroup.countries.length;
  }

  const regionColor = REGION_COLORS[entry.region] || REGION_COLORS['Other'];

  tooltipContent = `
    <div class="tooltip-row tooltip-header" style="display:flex; align-items:center; gap:6px;">
      <div style="width:12px; height:12px; border-radius:50%; background:${regionColor};"></div>
      <span>${entry.region}</span>
    </div>
    <div class="tooltip-row tooltip-body">
      <span>Average Cost</span>
      <span><b>$${avgCost.toFixed(0)}</b></span>
    </div>
  `;
}
