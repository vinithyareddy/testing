this.apiService.getWidgetData(this.widgetId, dynamicFilters).subscribe((fCVs: any) => {
    this.ResponseFlag = true;
    
    // Initialize both categories with 0
    const totals: Record<string, number> = {
      'FCV': 0,
      'Non-FCV': 0
    };
    
    if (fCVs.length > 0) {
      // Sum FTE values by category
      fCVs.forEach((curr: SwfpFteByFCV) => {
        const category = curr.category || 'Non-FCV';
        if (totals.hasOwnProperty(category)) {
          totals[category] += curr.fte as number;
        } else {
          // Handle any unexpected category names
          if (category.toLowerCase().includes('non')) {
            totals['Non-FCV'] += curr.fte as number;
          } else {
            totals['FCV'] += curr.fte as number;
          }
        }
      });
    }
    
    // Create array with both slices, sorted ascending by FTE
    this.fcvStatus = [
      {
        category: 'FCV',
        fte: totals['FCV'],
        color: '#3E9B9A'  // Darker color for FCV
      },
      {
        category: 'Non-FCV',
        fte: totals['Non-FCV'],
        color: '#95DAD9'  // Lighter color for Non-FCV
      }
    ].sort((a, b) => a.fte - b.fte);  // Sort ascending (smallest first)
    
    this.onInitLoad(this.fcvStatus);
  });