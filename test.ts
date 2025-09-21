tooltipContent = `
  <div class="tooltip-row tooltip-header">
    <img 
      src="assets/images/flags/${entry.code.toLowerCase()}.svg" 
      alt="${entry.country} flag"
      class="flag-icon"
      title="${entry.country}"
    />
    <span>${entry.country}</span>
  </div>
  <div class="tooltip-row tooltip-body">
    <span>Average Cost</span>
    <span><b>$${entry.cost}</b></span>
  </div>
`;
