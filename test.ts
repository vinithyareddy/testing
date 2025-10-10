ngOnInit() {
  console.log("🚀 ngOnInit called");
  
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("🔥 Filter subscription fired", x);
    
    // ==================== WHEN API IS FIXED: UNCOMMENT BELOW ====================
    // this.apiService.getWidgetData(this.widgetId).subscribe((proficiencyData: any) => {
    //   console.log("✅ API Response => ", proficiencyData);
    //   const dataToProcess = proficiencyData;
    // ===========================================================================
    
    // ==================== TEMPORARY: USING MOCK DATA ====================
    // TODO: When API is fixed, delete this line and uncomment API section above
    const dataToProcess = MOCK_PROFICIENCY_DATA;
    // ====================================================================
    
    if (dataToProcess && dataToProcess.length > 0) {
      console.log("✨ Processing data... Length:", dataToProcess.length);
      
      // Get unique skill levels
      const uniqueLevels = [...new Set(dataToProcess.map(item => item.skill_name))].sort();
      this.allCategories = uniqueLevels;
      console.log("✅ Categories:", this.allCategories);

      // Get unique proficiency types
      const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

      // Build series data - AGGREGATE FTE across all fiscal years
      this.allSeriesData = proficiencyTypes.map(profType => {
        return uniqueLevels.map(level => {
          // Sum all FTE values for this combo across ALL years
          const total = dataToProcess
            .filter(item => 
              item.skill_name === level && 
              item.prof_skill_overall_name === profType
            )
            .reduce((sum, item) => sum + item.fte, 0);
          
          return total;
        });
      });

      console.log("✅ Series data (aggregated):", this.allSeriesData);

      // Build and show chart
      this.buildInitialChart();
      this.ResponseFlag = true;
      this.cdr.detectChanges();
      console.log("✅ Chart built and displayed!");
    } else {
      console.warn("⚠️ No data to process");
      this.allCategories = [];
      this.allSeriesData = [[], [], [], []];
      this.ResponseFlag = true;
      this.cdr.detectChanges();
    }
    
    // ==================== WHEN API IS FIXED: UNCOMMENT BELOW ====================
    // }, (error) => {
    //   console.error("❌ API Error:", error);
    //   this.allCategories = [];
    //   this.allSeriesData = [[], [], [], []];
    //   this.ResponseFlag = true;
    //   this.cdr.detectChanges();
    // });
    // ===========================================================================
  });
}