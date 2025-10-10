ngOnInit() {
  console.log("🚀 ngOnInit called");
  
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("🔥 Filter subscription fired", x);
    console.log("filters", x);

    this.apiService.getWidgetData(this.widgetId).subscribe((proficiencyData: any) => {
      console.log("✅ API Response => ", proficiencyData);
      
      // TODO: Remove mock data when API is fixed
      const dataToProcess = MOCK_PROFICIENCY_DATA;
      console.log("📊 Data to process:", dataToProcess);
      // When API fixed: const dataToProcess = proficiencyData;
      
      if (dataToProcess && dataToProcess.length > 0) {
        console.log("✨ Processing data...");
        
        // Get unique skill levels - inline processing
        const uniqueLevels = [...new Set(dataToProcess.map((item: ProficiencyData) => item.skill_name))].sort();
        this.allCategories = uniqueLevels;

        // Get unique proficiency types
        const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

        // Build series data - inline
        this.allSeriesData = proficiencyTypes.map(profType => {
          return uniqueLevels.map(level => {
            const found = dataToProcess.find(
              (item: ProficiencyData) => item.skill_name === level && item.prof_skill_overall_name === profType
            );
            return found ? found.fte : 0;
          });
        });

        console.log("✅ Processed categories:", this.allCategories);
        console.log("✅ Processed series data:", this.allSeriesData);

        // Build and show chart
        this.buildInitialChart();
        this.ResponseFlag = true;
        this.cdr.detectChanges();
      } else {
        console.warn("⚠️ No data to process");
        // No data
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