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
      } else if (response && (response as any).data && Array.isArray((response as any).data) && (response as any).data.length > 0) {
        // Alternative: if API wraps data in a 'data' property
        this.processSkillProficiencyData((response as any).data);
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
}