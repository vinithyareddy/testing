if (this.selectedView === 'By Region') {
  const regionGroup = this.regionGroups.find(r => r.region === entry.region);
  const avgCost = regionGroup 
    ? (regionGroup.total / regionGroup.countries.length).toFixed(0) 
    : entry.cost;

  tooltipContent = `
    <div class="tooltip-row tooltip-header">${entry.region}</div>
    <div class="tooltip-row tooltip-body">
      <span>Average Cost</span>
      <span><b>$${avgCost}</b></span>
    </div>
  `;
} else {
  const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;

  // if legend normalizes cost, make sure tooltip uses same scale
  const scaledCost = entry.cost; // replace if you normalize
  
  tooltipContent = `
    <div class="tooltip-row tooltip-header">
      <img src="${flagUrl}" />
      <span>${entry.country}</span>
    </div>
    <div class="tooltip-row tooltip-body">
      <span>Average Cost</span>
      <span><b>$${scaledCost}</b></span>
    </div>
  `;
}
