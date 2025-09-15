.on('mouseover', (event: any, d: any) => {
  const entry = this.laborData.find(c => c.country === d.properties.name);

  if (entry) {
    let tooltipContent = '';

    if (this.selectedView === 'By Region') {
      // ✅ Match legend: use region average
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
      // ✅ Match legend: use country cost directly
      const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;
      const cost = entry.cost;  // same cost legend uses for scaling

      tooltipContent = `
        <div class="tooltip-row tooltip-header">
          <img src="${flagUrl}" />
          <span>${entry.country}</span>
        </div>
        <div class="tooltip-row tooltip-body">
          <span>Average Cost</span>
          <span><b>$${cost}</b></span>
        </div>
      `;
    }

    // position logic...
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const tooltipWidth = 160;
    const tooltipHeight = 60;
    let tooltipX = event.pageX - rect.left + 20;
    let tooltipY = event.pageY - rect.top + 20;

    if (tooltipX + tooltipWidth > rect.width) {
      tooltipX = event.pageX - rect.left - tooltipWidth - 10;
    }
    if (tooltipY + tooltipHeight > rect.height) {
      tooltipY = event.pageY - rect.top - tooltipHeight - 10;
    }

    this.tooltip.html(tooltipContent)
      .style('left', tooltipX + 'px')
      .style('top', tooltipY + 'px')
      .style('display', 'block');
  }
})
