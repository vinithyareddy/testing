tooltip.innerHTML = `
  <div class="tooltip-box">
    <div class="tooltip-header">
      <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" class="flag-icon" />
      <span class="country-name">${closest.country}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Unique Skills</span>
      <span class="tooltip-value">${closest.uniqueSkills}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Skill Supply (FTE)</span>
      <span class="tooltip-value">${closest.skillSupply}</span>
    </div>
  </div>
`;


.globe-tooltip {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  color: #111827;
  pointer-events: none;
  display: none;
  min-width: 200px;
  overflow: hidden;

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f3f4f6; // light grey
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;

    .flag-icon {
      width: 20px;
      height: auto;
      border-radius: 2px;
    }

    .country-name {
      font-weight: 600;
    }
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;
    border-bottom: 1px solid #f1f1f1;

    &:last-child {
      border-bottom: none;
    }

    .tooltip-label {
      color: #374151;
      font-size: 13px;
    }

    .tooltip-value {
      font-weight: 600;
      font-size: 13px;
      color: #111827;
    }
  }
}
