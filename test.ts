// ✅ Step 4: Restore original color scale and tones
let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;

// Normalize small value range to keep colors vivid
if (maxSkills - minSkills < 20) {
  minSkills = 0;
  maxSkills = maxSkills * 2;
}

// 🔹 Use the exact original 5-color gradient
this.countryColorScale = d3.scaleLinear<string>()
  .domain([
    minSkills,
    (minSkills + maxSkills) * 0.25,
    (minSkills + maxSkills) * 0.5,
    (minSkills + maxSkills) * 0.75,
    maxSkills
  ])
  .range([
    '#f5f0e4',   // light cream
    '#dbd5c8ff', // beige
    '#bed8ceff', // pale teal
    '#99c5b4ff', // soft mint green
    '#87c3ab'    // deeper green
  ]);
