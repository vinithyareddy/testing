ngOnInit(): void {
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((x: string) => {
      
      this.apiService.getWidgetData(this.widgetId).subscribe((response: any) => {
        console.log("API Response => ", response);
        
        this.skillProficiencyData = [];
        
        if (response && response.length > 0) {
          
          // Step 1: Group by skill_name and proficiency, sum FTE
          const grouped: { [skillName: string]: { [proficiency: string]: number } } = {};
          
          response.forEach((item: any) => {
            const skill = item.skill_name;
            const proficiency = item.proficiency;
            const fte = item.fte || 0;
            
            if (!skill || !proficiency) return;
            
            if (!grouped[skill]) {
              grouped[skill] = {};
            }
            
            if (!grouped[skill][proficiency]) {
              grouped[skill][proficiency] = 0;
            }
            
            grouped[skill][proficiency] += Number(fte);
          });
          
          // Step 2: Calculate total FTE for each skill and sort ASCENDING
          const proficiencyOrder = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
          
          const skillTotals = Object.keys(grouped).map(skill => {
            const total = proficiencyOrder.reduce((sum, prof) => {
              return sum + (grouped[skill][prof] || 0);
            }, 0);
            return { skill, total };
          });
          
          // Sort by total FTE in ASCENDING order (smallest to largest)
          skillTotals.sort((a, b) => a.total - b.total);
          
          // Extract sorted skill names
          this.allCategories = skillTotals.map(item => item.skill);
          
          // Step 3: Build series data for each proficiency level (using sorted categories)
          this.allSeriesData = proficiencyOrder.map(proficiency => {
            return this.allCategories.map(skill => {
              return grouped[skill][proficiency] || 0;
            });
          });
          
          console.log("Processed Categories (Sorted):", this.allCategories);
          console.log("Processed Series Data:", this.allSeriesData);
        }
        
        this.buildChart();
      });
    });
  }