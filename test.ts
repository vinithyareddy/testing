// 🔹 Recalculate color scale based on new API data
const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;

this.countryColorScale = d3.scaleLinear<string>()
  .domain([
    minSkills,
    (minSkills + maxSkills) * 0.25,
    (minSkills + maxSkills) * 0.5,
    (minSkills + maxSkills) * 0.75,
    maxSkills
  ])
  .range([
    '#f5f0e4',
    '#dbd5c8ff',
    '#bed8ceff',
    '#99c5b4ff',
    '#87c3ab'
  ]);
