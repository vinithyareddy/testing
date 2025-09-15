this.tooltip = d3.select(globeDiv)
  .append('div')
  .style('position', 'absolute')
  .style('pointer-events', 'none')
  .style('background', '#fff')                 // white background
  .style('color', '#333')                      // dark text
  .style('padding', '8px 14px')                // more padding
  .style('border-radius', '8px')               // rounded corners
  .style('box-shadow', '0 4px 10px rgba(0,0,0,0.15)') // soft shadow
  .style('font-size', '13px')
  .style('font-weight', '500')
  .style('border', '1px solid #e0e0e0')        // subtle border
  .style('z-index', '10')
  .style('display', 'none');
