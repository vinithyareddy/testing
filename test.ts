ngOnInit(): void {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);
    
    this.apiService.getWidgetData(this.widgetId).subscribe((genders: any) => {
      console.log("API Response => ", genders);
      
      if (genders && genders.length > 0) {
        const totals = genders.reduce((acc: Record<string, number>, curr: any) => {
          const category = curr.category || 'Unknown';
          acc[category] = (acc[category] || 0) + (curr.fte || curr.value || 0);
          return acc;
        }, {});

        this.genderData = Object.entries(totals).map(([category, fte]) => ({
          name: category,      // ✅ Using 'name' instead of 'category'
          y: fte as number,    // ✅ Using 'y' instead of 'fte'
          color: category.toLowerCase().includes('male') && !category.toLowerCase().includes('female') 
            ? '#34a7f2' 
            : '#aedcfa'
        }));
      } else {
        this.genderData = [];
      }
      
      this.ResponseFlag = true;
      this.loadChart();
    });
  });
}