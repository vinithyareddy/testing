if (this.selectedView === 'By Region') {
  // In Region view, the legend is categorical, so tooltip should match it
  const regionColor = REGION_COLORS[entry.region] || REGION_COLORS['Other'];

  tooltipContent = `
    <div class="tooltip-row tooltip-header" style="display:flex; align-items:center; gap:6px;">
      <div style="width:12px; height:12px; border-radius:50%; background:${regionColor};"></div>
      <span>${entry.region}</span>
    </div>
  `;
}
