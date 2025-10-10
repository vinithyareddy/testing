// ✅ Keep your original color codes, but adjust domain spread
const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;

// Compress the upper range so mid-values get more color variation
const adjustedMax = Math.sqrt(maxSkills) * 10; // normalize big numbers
const domainRange = [
  minSkills,
  adjustedMax * 0.25,
  adjustedMax * 0.5,
  adjustedMax * 0.75,
  adjustedMax
];

this.countryColorScale = d3.scaleLinear<string>()
  .domain(domainRange)
  .range([
    '#f5f0e4',
    '#dbd5c8ff',
    '#bed8ceff',
    '#99c5b4ff',
    '#87c3ab'
  ]);
