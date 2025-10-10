private processProficiencyData(apiData: ProficiencyData[]): void {
  console.log("Processing proficiency data:", apiData);

  this.proficiencyData = apiData;

  // Get unique skill levels
  const uniqueLevels = [...new Set(apiData.map(item => item.skill_name))].sort();
  this.allCategories = uniqueLevels;

  // Get unique proficiency types
  const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

  // Build series data
  this.allSeriesData = proficiencyTypes.map(profType => {
    return uniqueLevels.map(level => {
      const found = apiData.find(
        item => item.skill_name === level && item.prof_skill_overall_name === profType
      );
      return found ? found.fte : 0;
    });
  });

  console.log("Processed categories:", this.allCategories);
  console.log("Processed series data:", this.allSeriesData);

  // Update chart and show it
  setTimeout(() => {
    this.updateChart();
    this.ResponseFlag = true;
  }, 150);
}

<highcharts-chart 
    *ngIf="allCategories.length > 0"
    [Highcharts]="Highcharts" 
    [options]="chartOptions"
    [constructorType]="'chart'"
    style="width: 99%; height: 330px; display: block;">
</highcharts-chart>