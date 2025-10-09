private processSkillProficiencyData(apiData: any[]): void {
  console.log("Processing skill proficiency data:", apiData);
  
  // Reset data
  this.allCategories = [];
  this.allSeriesData = [[], [], [], []];
  
  // Define proficiency levels order
  const proficiencyLevels = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
  
  // Group data by skill_name
  const groupedBySkill = _.groupBy(apiData, 'skill_name');
  
  // Get all unique skill names (categories)
  this.allCategories = Object.keys(groupedBySkill);
  
  console.log("Categories (Skills):", this.allCategories);
  
  // For each proficiency level, create a series
  proficiencyLevels.forEach((profLevel, seriesIndex) => {
    this.allSeriesData[seriesIndex] = [];
    
    // For each skill (category), find the FTE for this proficiency level
    this.allCategories.forEach(skillName => {
      const skillData = groupedBySkill[skillName];
      
      // Find the item with matching proficiency level
      const matchingItem = skillData.find(item => 
        item.proficiency === profLevel || 
        item.prof_skill_overall_name === profLevel
      );
      
      // Add the FTE value, or 0 if not found
      const fteValue = matchingItem ? Number(matchingItem.fte) : 0;
      this.allSeriesData[seriesIndex].push(fteValue);
    });
  });
  
  console.log("Processed series data:", this.allSeriesData);
  
  // Reset to first page and update chart
  this.currentPage = 0;
  this.updateChart();
}

ngOnInit() {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);
    
    // Call API and handle response
    this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
      console.log("API Response => ", response);
      
      // Check if response is an array with data
      if (response && Array.isArray(response) && response.length > 0) {
        this.processSkillProficiencyData(response);
      } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        this.processSkillProficiencyData(response.data);
      } else {
        // No data found - show empty state
        console.log("No data received from API");
        this.allCategories = [];
        this.allSeriesData = [[], [], [], []];
        this.updateChart();
      }
    }, (error) => {
      console.error("API Error:", error);
      // Handle error
      this.allCategories = [];
      this.allSeriesData = [[], [], [], []];
      this.updateChart();
    });
  });
  
  // Note: Removed the mock data generation
  // The chart will be populated by API data
}