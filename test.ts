private loadMockData(): void {
  console.log("Loading mock data for demonstration");
  
  // Create mock data with skill names and proficiency levels
  const mockSkills = [
    'Java', 'Python', 'JavaScript', 'Angular', 'React', 
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'TypeScript', 'Node.js'
  ];
  
  const proficiencyLevels = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
  
  // Generate mock API response format
  const mockApiData: any[] = [];
  
  mockSkills.forEach(skill => {
    proficiencyLevels.forEach(proficiency => {
      // Random FTE count between 10 and 100
      const fte = Math.floor(Math.random() * 90) + 10;
      mockApiData.push({
        fiscal_year: '2025',
        skill_name: skill,
        proficiency: proficiency,
        fte: fte
      });
    });
  });
  
  console.log("Mock API data created:", mockApiData);
  
  // Process the mock data using the same method
  this.processSkillProficiencyData(mockApiData);
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
        // Check if the response has the correct structure (skill_name, proficiency, fte)
        const hasCorrectStructure = response.some(item => 
          item.skill_name && item.proficiency
        );
        
        if (hasCorrectStructure) {
          // Process real API data
          this.processSkillProficiencyData(response);
        } else {
          // API structure is wrong, use mock data for now
          console.log("API structure incorrect, using mock data");
          this.loadMockData();
        }
      } else if (response && (response as any).data && Array.isArray((response as any).data) && (response as any).data.length > 0) {
        this.processSkillProficiencyData((response as any).data);
      } else {
        // No data from API, use mock data for now
        console.log("No data received from API, using mock data");
        this.loadMockData();
      }
    }, (error) => {
      console.error("API Error:", error);
      // On error, use mock data
      this.loadMockData();
    });
  });
}