this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
  console.log("API Response => ", response);
  
  if (response && Array.isArray(response) && response.length > 0) {
    this.processProficiencyData(response);  // ← Use real API data
  } else {
    console.warn("No data from API");
    this.ResponseFlag = true;
  }
}, (error) => {
  console.error("API Error:", error);
  this.ResponseFlag = true;  // ← Just show empty state on error
});