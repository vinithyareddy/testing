let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;

// 🛡️ Safety: if range is too narrow or invalid, expand it
if (maxSkills - minSkills < 5) {
  minSkills = 0;
  maxSkills = Math.max(10, maxSkills * 2);
}

// ✅ Rebuild the color scale with consistent range
this.countryColorScale = d3.scaleLinear<string>()
  .domain([
    minSkills,
    minSkills + (maxSkills - minSkills) * 0.25,
    minSkills + (maxSkills - minSkills) * 0.5,
    minSkills + (maxSkills - minSkills) * 0.75,
    maxSkills
  ])
  .range([
    '#f5f0e4',
    '#dbd5c8ff',
    '#bed8ceff',
    '#99c5b4ff',
    '#87c3ab'
  ]);
