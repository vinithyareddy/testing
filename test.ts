.on('mouseover', (event: any, d: any) => {
  const entry = this.laborData.find(c => c.country === d.properties.name);

  if (entry) {
    let tooltipContent = '';

    if (this.selectedView === 'By Region') {
      // Region view → only region + cost
      tooltipContent = `
        <div style="font-weight:600; margin-bottom:4px;">${entry.region}</div>
        <div><b>Avg Cost:</b> $${entry.cost}</div>
      `;
    } else {
      // Country view → flag + country name + cost
      const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;
      tooltipContent = `
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <img src="${flagUrl}" style="width:20px; height:14px; border:1px solid #ccc;"/>
          <span style="font-weight:600;">${entry.country}</span>
        </div>
        <div><b>Avg Cost:</b> $${entry.cost}</div>
      `;
    }

    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.tooltip.html(tooltipContent)
      .style('left', (x + 15) + 'px')
      .style('top', (y + 15) + 'px')
      .style('display', 'block');
  }
})
