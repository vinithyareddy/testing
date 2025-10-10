ngOnInit() {
  console.log("🚀 ngOnInit called");
  
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("🔥 Filter subscription fired", x);
    
    // Call API
    this.apiService.getWidgetData(this.widgetId).subscribe((proficiencyData: any) => {
      console.log("✅ API Response => ", proficiencyData);
      
      // Use API data
      const dataToProcess = proficiencyData;
      
      if (dataToProcess && Array.isArray(dataToProcess) && dataToProcess.length > 0) {
        console.log("✨ Processing data... Length:", dataToProcess.length);
        
        // Get unique skill levels
        const uniqueLevels = [...new Set(dataToProcess.map((item: ProficiencyData) => item.skill_name))].sort();
        this.allCategories = uniqueLevels;
        console.log("✅ Categories:", this.allCategories);

        // Get unique proficiency types
        const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

        // Build series data
        this.allSeriesData = proficiencyTypes.map(profType => {
          return uniqueLevels.map(level => {
            const found = dataToProcess.find(
              (item: ProficiencyData) => item.skill_name === level && item.prof_skill_overall_name === profType
            );
            return found ? found.fte : 0;
          });
        });

        console.log("✅ Series data:", this.allSeriesData);

        // Build and show chart
        this.buildInitialChart();
        this.ResponseFlag = true;
        this.cdr.detectChanges();
        console.log("✅ Chart built and displayed!");
      } else {
        console.warn("⚠️ No data from API");
        this.allCategories = [];
        this.allSeriesData = [[], [], [], []];
        this.ResponseFlag = true;
        this.cdr.detectChanges();
      }
    }, (error) => {
      console.error("❌ API Error:", error);
      this.allCategories = [];
      this.allSeriesData = [[], [], [], []];
      this.ResponseFlag = true;
      this.cdr.detectChanges();
    });
  });
}


ngOnInit() {
  console.log("🚀 ngOnInit called");
  
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("🔥 Filter subscription fired", x);
    
    // ==================== TEMPORARY: USING MOCK DATA ====================
    // TODO: When API is fixed, replace this entire ngOnInit with the version above
    console.log("📊 Using MOCK DATA directly");
    const dataToProcess = MOCK_PROFICIENCY_DATA;
    // ====================================================================
    
    if (dataToProcess && dataToProcess.length > 0) {
      console.log("✨ Processing data... Length:", dataToProcess.length);
      
      // Get unique skill levels
      const uniqueLevels = [...new Set(dataToProcess.map((item: ProficiencyData) => item.skill_name))].sort();
      this.allCategories = uniqueLevels;
      console.log("✅ Categories:", this.allCategories);

      // Get unique proficiency types
      const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

      // Build series data
      this.allSeriesData = proficiencyTypes.map(profType => {
        return uniqueLevels.map(level => {
          const found = dataToProcess.find(
            (item: ProficiencyData) => item.skill_name === level && item.prof_skill_overall_name === profType
          );
          return found ? found.fte : 0;
        });
      });

      console.log("✅ Series data:", this.allSeriesData);

      // Build and show chart
      this.buildInitialChart();
      this.ResponseFlag = true;
      this.cdr.detectChanges();
      console.log("✅ Chart built and displayed!");
    }
  });
}