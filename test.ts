tooltip.innerHTML = `
  <div class="tooltip-content">
    <div class="country-header">
      <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" class="flag-icon" />
      <div class="country-name">${closest.country}</div>
    </div>
    <div class="tooltip-metrics">
      <div class="metric-row">
        <span class="metric-label">Unique Skills</span>
        <span class="metric-label">Skill Supply (FTE)</span>
      </div>
      <div class="metric-row">
        <span class="metric-value">${closest.uniqueSkills}</span>
        <span class="metric-value">${closest.skillSupply}</span>
      </div>
    </div>
  </div>
`;


.globe-tooltip {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  pointer-events: none;
  display: none;
  z-index: 2000;
  max-width: 250px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .country-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .flag-icon {
      width: 20px;
      height: auto;
      margin-right: 8px;
      border-radius: 2px;
    }

    .country-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }
  }

  .tooltip-metrics {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .metric-row {
      display: flex;
      justify-content: space-between;
      color: #4b5563;

      .metric-label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
      }

      .metric-value {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
      }
    }
  }
}
