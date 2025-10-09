console.log("=== Step 4: Final countries list ===", this.countriesList);
console.log("=== Total matched countries:", this.countriesList.length);

if (this.countriesList.length === 0) {
  console.error("NO COUNTRIES MATCHED! Loading static data as fallback");
  this.loadData();
  return;
}

// === ADD COLOR SCALE CALCULATION HERE ===
console.log("=== Step 5: Calculating color scale ===");

// Get min and max skills for color scaling
const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;

console.log(`Min skills: ${minSkills}, Max skills: ${maxSkills}`);

// Update the color scale based on actual data
this.countryColorScale = d3.scaleLinear<string>()
  .domain([
    minSkills, 
    minSkills + (maxSkills - minSkills) * 0.25,
    minSkills + (maxSkills - minSkills) * 0.5,
    minSkills + (maxSkills - minSkills) * 0.75,
    maxSkills
  ])
  .range([
    '#f5f0e4',    // lightest (lowest skills)
    '#dbd5c8ff',  
    '#bed8ceff',  
    '#99c5b4ff',  
    '#87c3ab'     // darkest (highest skills)
  ]);

console.log("=== Color scale updated ===");

// Update the display
this.filteredList = [...this.countriesList];