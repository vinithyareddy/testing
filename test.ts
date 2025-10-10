export const SKILL_PROFICIENCY_MOCK_DATA = [
  // Level 1
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 1", fte: 450 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 1", fte: 520 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 1", fte: 380 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 1", fte: 290 },
  
  // Level 2
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 2", fte: 520 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 2", fte: 610 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 2", fte: 480 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 2", fte: 350 },
  
  // Level 3
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 3", fte: 410 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 3", fte: 550 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 3", fte: 520 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 3", fte: 420 },
  
  // Level 4
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 4", fte: 380 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 4", fte: 490 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 4", fte: 560 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 4", fte: 470 },
  
  // Level 5
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 5", fte: 320 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 5", fte: 440 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 5", fte: 590 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 5", fte: 510 },
  
  // Level 6
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 6", fte: 290 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 6", fte: 410 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 6", fte: 530 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 6", fte: 580 },
  
  // Level 7
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 7", fte: 260 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 7", fte: 380 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 7", fte: 490 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 7", fte: 620 },
  
  // Level 8
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 8", fte: 240 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 8", fte: 350 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 8", fte: 460 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 8", fte: 550 },
  
  // Level 9
  { fiscal_year: "2025", skill_name: "Awareness", prof_skill_overall_name: "Level 9", fte: 210 },
  { fiscal_year: "2025", skill_name: "Skilled", prof_skill_overall_name: "Level 9", fte: 320 },
  { fiscal_year: "2025", skill_name: "Advanced", prof_skill_overall_name: "Level 9", fte: 430 },
  { fiscal_year: "2025", skill_name: "Expert", prof_skill_overall_name: "Level 9", fte: 510 }
];


import { SKILL_PROFICIENCY_MOCK_DATA } from './skill-proficiency-mock-data';



ngOnInit() {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);

    this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
      console.log("API Response => ", response);
      
      // TODO: Once API is fixed, change to: const dataToProcess = response;
      const dataToProcess = SKILL_PROFICIENCY_MOCK_DATA;
      
      if (dataToProcess && Array.isArray(dataToProcess) && dataToProcess.length > 0) {
        this.processSkillProficiencyData(dataToProcess);
      } else {
        console.log("No data received");
        this.allCategories = [];
        this.allSeriesData = [[], [], [], []];
        this.updateChart();
      }
    }, (error) => {
      console.error("API Error:", error);
      this.processSkillProficiencyData(SKILL_PROFICIENCY_MOCK_DATA);
    });
  });
}

private processSkillProficiencyData(apiData: any[]): void {
  console.log("Processing skill proficiency data:", apiData);

  const groupedByLevel = _.groupBy(apiData, 'prof_skill_overall_name');
  
  this.allCategories = Object.keys(groupedByLevel).sort((a, b) => {
    const numA = parseInt(a.replace('Level ', ''));
    const numB = parseInt(b.replace('Level ', ''));
    return numA - numB;
  });

  const skillNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
  this.allSeriesData = [[], [], [], []];

  this.allCategories.forEach(level => {
    const levelData = groupedByLevel[level];
    
    skillNames.forEach((skillName, skillIndex) => {
      const skillData = levelData.find(item => item.skill_name === skillName);
      const fteValue = skillData ? Number(skillData.fte) : 0;
      this.allSeriesData[skillIndex].push(fteValue);
    });
  });

  console.log("Processed data - Categories:", this.allCategories);
  console.log("Processed data - Series:", this.allSeriesData);

  this.currentPage = 0;
  this.updateChart();
}