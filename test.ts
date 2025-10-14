// Step 3: Extract all unique skill names and sort by TOTAL FTE (ascending)
const proficiencyOrder = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

// Calculate total FTE for each skill (sum across all proficiency levels)
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

// Step 4: Build series data for each proficiency level (using sorted categories)
const proficiencyOrder = ['Awareness', 'Skilled', 'Advanced', 'Expert'];

this.allSeriesData = proficiencyOrder.map(proficiency => {
  return this.allCategories.map(skill => {
    return grouped[skill][proficiency] || 0;
  });
});