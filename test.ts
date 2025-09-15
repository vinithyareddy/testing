tooltip.innerHTML = `
  <div class="tooltip-box">
    <div class="tooltip-header">
      <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" class="flag-icon" />
      <span class="country-name">${closest.country}</span>
    </div>
    <hr />
    <div class="tooltip-row">
      <span class="label">Unique Skills</span>
      <span class="value">${closest.uniqueSkills}</span>
    </div>
    <div class="tooltip-row">
      <span class="label">Skill Supply (FTE)</span>
      <span class="value">${closest.skillSupply}</span>
    </div>
  </div>
`;
.globe-tooltip {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  max-width: 250px;
  pointer-events: none;
  overflow: hidden;
  padding: 0; // remove default padding
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6; // light grey header
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.tooltip-header .flag-icon {
  width: 20px;
  height: auto;
  border-radius: 2px;
}

.globe-tooltip hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
}

.tooltip-row .label {
  font-size: 13px;
  color: #374151;
}

.tooltip-row .value {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}
