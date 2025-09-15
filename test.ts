tooltip.innerHTML = `
  <div class="tooltip-header">
    <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" class="flag-icon" />
    <span class="country-name">${closest.country}</span>
  </div>
  <hr />
  <div class="tooltip-metrics">
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
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0; // remove global padding, structure will add spacing
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  pointer-events: none;
  display: none;
  z-index: 2000;
  max-width: 260px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .tooltip-header {
    display: flex;
    align-items: center;
    background: #f9fafb;  // light grey header
    padding: 8px 12px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .flag-icon {
      width: 20px;
      height: auto;
      margin-right: 8px;
      border-radius: 2px;
    }

    .country-name {
      font-weight: 600;
      font-size: 14px;
      color: #1f2937;
    }
  }

  hr {
    margin: 0;
    border: none;
    border-top: 1px solid #e5e7eb;
  }

  .tooltip-metrics {
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
        font-weight: 600;
        font-size: 13px;
        color: #111827;
      }
    }
  }
}
