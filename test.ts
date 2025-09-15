.on('mouseover', (event: any, d: any) => {
  // ... build tooltipContent ...

  const rect = this.globeContainer.nativeElement.getBoundingClientRect();
  const tooltipWidth = 160;
  const tooltipHeight = 60;

  // Use pageX/Y so offset is absolute to the page
  let tooltipX = event.pageX - rect.left + 20;  // 20px right of cursor
  let tooltipY = event.pageY - rect.top + 20;   // 20px below cursor

  // Prevent going off-screen
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
})
.on('mousemove', (event: any) => {
  const rect = this.globeContainer.nativeElement.getBoundingClientRect();
  let tooltipX = event.pageX - rect.left + 20;
  let tooltipY = event.pageY - rect.top + 20;

  this.tooltip
    .style('left', tooltipX + 'px')
    .style('top', tooltipY + 'px');
})
