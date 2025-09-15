tooltip.innerHTML = `
  <div class="tooltip-header">
    <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" class="flag-icon" />
    <span class="country-name">${closest.country}</span>
  </div>
  <div class="tooltip-body">
    <div class="metric-row">
      <span class="metric-label">Unique Skills</span>
      <span class="metric-value">${closest.uniqueSkills}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Skill Supply (FTE)</span>
      <span class="metric-value">${closest.skillSupply}</span>
    </div>
  </div>
`;


.globe-tooltip {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  max-width: 250px;
  pointer-events: none;
  overflow: hidden;

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f9fafb;
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
  }

  .tooltip-body {
    padding: 8px 12px;

    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;

      &:last-child {
        margin-bottom: 0;
      }

      .metric-label {
        font-size: 13px;
        color: #374151;
      }

      .metric-value {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
      }
    }
  }
}
