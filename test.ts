private processGenderData(apiData: any[]): void {
  console.log("Processing gender data:", apiData);
  
  // Clear existing data
  this.genderData = [];
  
  // Process the API response
  apiData.forEach(item => {
    // Map the API response fields: Category and fte
    const gender = item.Category;  // Capital 'C' - matches API
    const count = item.fte;         // lowercase 'fte' - matches API
    
    if (gender && count !== undefined && count !== null) {
      this.genderData.push({
        name: gender,
        y: Number(count)
      });
    }
  });
  
  console.log("Processed gender data:", this.genderData);
  
  // Reload chart with new data
  this.loadChart();
}