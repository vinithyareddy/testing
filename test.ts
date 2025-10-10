private processProficiencyData(apiData: ProficiencyData[]): void {
  console.log("Processing proficiency data:", apiData);
  
  this.proficiencyData = apiData;
  
  // Get unique skill levels (Level 1, Level 2, etc.) - these are categories (x-axis)
  const uniqueLevels = [...new Set(apiData.map(item => item.skill_name))].sort();
  this.allCategories = uniqueLevels;
  
  // Get unique proficiency types (Awareness, Skilled, Advanced, Expert) - these are series
  const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
  
  // Build series data: for each proficiency type, get FTE values for each level
  this.allSeriesData = proficiencyTypes.map(profType => {
    return uniqueLevels.map(level => {
      const found = apiData.find(
        item => item.skill_name === level && item.prof_skill_overall_name === profType
      );
      return found ? found.fte : 0;
    });
  });
  
  console.log("Processed categories:", this.allCategories);
  console.log("Processed series data:", this.allSeriesData);
  
  // Update chart with processed data - with a small delay to ensure DOM is ready
  setTimeout(() => {
    this.updateChart();
    this.ResponseFlag = true; // Show the chart AFTER it's built
  }, 100);
}