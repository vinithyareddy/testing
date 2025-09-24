this.countryColorScale = d3.scaleLinear<string>()
  .domain([minSkills, (minSkills + maxSkills) * 0.25, (minSkills + maxSkills) * 0.5, (minSkills + maxSkills) * 0.75, maxSkills])
  .range([
    '#fdfde7',  // cream
    '#e6f5d0',  // very light green
    '#b8e186',  // light green
    '#4dac26',  // green
    '#276419'   // dark forest green
  ]);
