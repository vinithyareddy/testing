tooltip.innerHTML = `
  <div class="tooltip-header">
    <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" />
    <span>${closest.country}</span>
  </div>
  <div class="tooltip-row">
    <span class="label">Unique Skills</span>
    <span class="value">${closest.uniqueSkills}</span>
  </div>
  <div class="tooltip-row">
    <span class="label">Skill Supply (FTE)</span>
    <span class="value">${closest.skillSupply}</span>
  </div>
`;
