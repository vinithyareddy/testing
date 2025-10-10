ngOnInit() {
  console.log("🚀 ngOnInit called");
  
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("🔥 Filter subscription fired", x);
    
    // ==================== TEMPORARY: USING MOCK DATA ====================
    // TODO: When API is fixed, replace MOCK_PROFICIENCY_DATA with API response
    console.log("📊 Using MOCK DATA directly");
    const dataToProcess = MOCK_PROFICIENCY_DATA;
    // When API fixed: const dataToProcess = proficiencyData (from API response)
    // The filter/year selection will be handled by backend based on filter state
    // ====================================================================
    
    if (dataToProcess && dataToProcess.length > 0) {
      console.log("✨ Processing data... Length:", dataToProcess.length);
      
      // Get unique skill levels (categories for x-axis)
      const uniqueLevels = [...new Set(dataToProcess.map((item: SwfpProficiencyData) => item.skill_name))].sort();
      this.allCategories = uniqueLevels;
      console.log("✅ Categories:", this.allCategories);

      // Get unique proficiency types (series)
      const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

      // Build series data - AGGREGATE FTE across all fiscal years
      this.allSeriesData = proficiencyTypes.map(profType => {
        return uniqueLevels.map(level => {
          // Sum all FTE values for this skill_name + proficiency combo across ALL years
          const total = dataToProcess
            .filter((item: SwfpProficiencyData) => 
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
  });
}

export const MOCK_PROFICIENCY_DATA: SwfpProficiencyData[] = [
  // ==================== 2025 DATA ====================
  // Level 1
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Awareness', fte: 120 },
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Skilled', fte: 80 },
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Advanced', fte: 50 },
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Expert', fte: 30 },

  // Level 2
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Awareness', fte: 100 },
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Skilled', fte: 90 },
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Advanced', fte: 70 },
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Expert', fte: 40 },

  // Level 3
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Awareness', fte: 110 },
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Skilled', fte: 95 },
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Advanced', fte: 60 },
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Expert', fte: 35 },

  // Level 4
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Awareness', fte: 90 },
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Skilled', fte: 100 },
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Advanced', fte: 80 },
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Expert', fte: 50 },

  // Level 5
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Awareness', fte: 85 },
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Skilled', fte: 75 },
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Advanced', fte: 65 },
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Expert', fte: 45 },

  // Level 6
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Awareness', fte: 95 },
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Skilled', fte: 85 },
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Advanced', fte: 55 },
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Expert', fte: 38 },

  // Level 7
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Awareness', fte: 105 },
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Skilled', fte: 88 },
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Advanced', fte: 72 },
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Expert', fte: 42 },

  // Level 8
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Awareness', fte: 92 },
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Skilled', fte: 82 },
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Advanced', fte: 68 },
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Expert', fte: 48 },

  // Level 9
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Awareness', fte: 98 },
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Skilled', fte: 78 },
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Advanced', fte: 58 },
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Expert', fte: 36 },

  // ==================== 2024 DATA ====================
  // Level 1
  { fiscal_year: '2024', skill_name: 'Level 1', prof_skill_overall_name: 'Awareness', fte: 115 },
  { fiscal_year: '2024', skill_name: 'Level 1', prof_skill_overall_name: 'Skilled', fte: 75 },
  { fiscal_year: '2024', skill_name: 'Level 1', prof_skill_overall_name: 'Advanced', fte: 45 },
  { fiscal_year: '2024', skill_name: 'Level 1', prof_skill_overall_name: 'Expert', fte: 28 },

  // Level 2
  { fiscal_year: '2024', skill_name: 'Level 2', prof_skill_overall_name: 'Awareness', fte: 95 },
  { fiscal_year: '2024', skill_name: 'Level 2', prof_skill_overall_name: 'Skilled', fte: 85 },
  { fiscal_year: '2024', skill_name: 'Level 2', prof_skill_overall_name: 'Advanced', fte: 65 },
  { fiscal_year: '2024', skill_name: 'Level 2', prof_skill_overall_name: 'Expert', fte: 38 },

  // Level 3
  { fiscal_year: '2024', skill_name: 'Level 3', prof_skill_overall_name: 'Awareness', fte: 105 },
  { fiscal_year: '2024', skill_name: 'Level 3', prof_skill_overall_name: 'Skilled', fte: 90 },
  { fiscal_year: '2024', skill_name: 'Level 3', prof_skill_overall_name: 'Advanced', fte: 55 },
  { fiscal_year: '2024', skill_name: 'Level 3', prof_skill_overall_name: 'Expert', fte: 32 },

  // Level 4
  { fiscal_year: '2024', skill_name: 'Level 4', prof_skill_overall_name: 'Awareness', fte: 85 },
  { fiscal_year: '2024', skill_name: 'Level 4', prof_skill_overall_name: 'Skilled', fte: 95 },
  { fiscal_year: '2024', skill_name: 'Level 4', prof_skill_overall_name: 'Advanced', fte: 75 },
  { fiscal_year: '2024', skill_name: 'Level 4', prof_skill_overall_name: 'Expert', fte: 48 },

  // Level 5
  { fiscal_year: '2024', skill_name: 'Level 5', prof_skill_overall_name: 'Awareness', fte: 80 },
  { fiscal_year: '2024', skill_name: 'Level 5', prof_skill_overall_name: 'Skilled', fte: 70 },
  { fiscal_year: '2024', skill_name: 'Level 5', prof_skill_overall_name: 'Advanced', fte: 60 },
  { fiscal_year: '2024', skill_name: 'Level 5', prof_skill_overall_name: 'Expert', fte: 42 },

  // Level 6
  { fiscal_year: '2024', skill_name: 'Level 6', prof_skill_overall_name: 'Awareness', fte: 90 },
  { fiscal_year: '2024', skill_name: 'Level 6', prof_skill_overall_name: 'Skilled', fte: 80 },
  { fiscal_year: '2024', skill_name: 'Level 6', prof_skill_overall_name: 'Advanced', fte: 50 },
  { fiscal_year: '2024', skill_name: 'Level 6', prof_skill_overall_name: 'Expert', fte: 35 },

  // Level 7
  { fiscal_year: '2024', skill_name: 'Level 7', prof_skill_overall_name: 'Awareness', fte: 100 },
  { fiscal_year: '2024', skill_name: 'Level 7', prof_skill_overall_name: 'Skilled', fte: 83 },
  { fiscal_year: '2024', skill_name: 'Level 7', prof_skill_overall_name: 'Advanced', fte: 68 },
  { fiscal_year: '2024', skill_name: 'Level 7', prof_skill_overall_name: 'Expert', fte: 40 },

  // Level 8
  { fiscal_year: '2024', skill_name: 'Level 8', prof_skill_overall_name: 'Awareness', fte: 88 },
  { fiscal_year: '2024', skill_name: 'Level 8', prof_skill_overall_name: 'Skilled', fte: 78 },
  { fiscal_year: '2024', skill_name: 'Level 8', prof_skill_overall_name: 'Advanced', fte: 63 },
  { fiscal_year: '2024', skill_name: 'Level 8', prof_skill_overall_name: 'Expert', fte: 45 },

  // Level 9
  { fiscal_year: '2024', skill_name: 'Level 9', prof_skill_overall_name: 'Awareness', fte: 93 },
  { fiscal_year: '2024', skill_name: 'Level 9', prof_skill_overall_name: 'Skilled', fte: 73 },
  { fiscal_year: '2024', skill_name: 'Level 9', prof_skill_overall_name: 'Advanced', fte: 53 },
  { fiscal_year: '2024', skill_name: 'Level 9', prof_skill_overall_name: 'Expert', fte: 33 }
];