if (this.selectedView === 'By Region') {
  const regionGroup = this.regionGroups.find(r => r.region === entry.region);

  let avgCost = 0;
  if (regionGroup) {
    avgCost = regionGroup.total / regionGroup.countries.length;
  }

  // ✅ round or format to match legend
  const displayCost = avgCost.toFixed(0);

  tooltipContent = `
    <div class="tooltip-row tooltip-header">${entry.region}</div>
    <div class="tooltip-row tooltip-body">
      <span>Average Cost</span>
      <span><b>$${displayCost}</b></span>
    </div>
  `;
}
