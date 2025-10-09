ngOnInit(): void {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);
    
    // Call API and handle response
    this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
      console.log("API Response => ", response);
      
      // Check if response has data
      if (response && response.data && response.data.length > 0) {
        this.processGenderData(response.data);
      } else {
        // No data found - show empty state
        this.genderData = [];
        this.loadChart();
      }
    }, (error) => {
      console.error("API Error:", error);
      // Handle error - maybe show error message
      this.genderData = [];
      this.loadChart();
    });
  });
  
  // Initial chart load with static data (will be replaced by API data)
  this.loadChart();
}

private processGenderData(apiData: any[]): void {
  console.log("Processing gender data:", apiData);
  
  // Clear existing data
  this.genderData = [];
  
  // Process the API response
  // Based on the call transcripts, the API returns data with category (gender) and value (FTE count)
  apiData.forEach(item => {
    // Map the API response to your chart data structure
    // Adjust property names based on actual API response
    const gender = item.category || item.gender || item.name; // adjust based on actual field
    const count = item.value || item.fte || item.count || item.y; // adjust based on actual field
    
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