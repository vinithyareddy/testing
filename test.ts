.on('mouseover', (event: any, d: any) => {
  const entry = this.laborData.find(c => c.country === d.properties.name);

  if (entry) {
    let tooltipContent = '';

    if (this.selectedView === 'By Region') {
      // Region view → only region name + cost
      tooltipContent = `
        <div style="font-weight:600; margin-bottom:4px;">${entry.region}</div>
        <div><b>Avg Cost:</b> $${entry.cost}</div>
      `;
    } else {
      // Country view → only country name + cost
      tooltipContent = `
        <div style="font-weight:600; margin-bottom:4px;">${entry.country}</div>
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
