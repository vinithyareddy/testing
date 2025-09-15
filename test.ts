if (closest) {
  const vector = closest.position!.clone().project(this.camera);
  const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

  tooltip.innerHTML = `
    <div class="tooltip-header">
      <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" class="flag-icon" />
      <span class="country-name">${closest.country}</span>
    </div>
    <hr/>
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

  tooltip.style.left = `${x + 15}px`;
  tooltip.style.top = `${y + 15}px`;
  tooltip.style.display = 'block';
  return;
}
.globe-tooltip {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  pointer-events: none;
  display: none;
  z-index: 2000;
  max-width: 260px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .tooltip-header {
    display: flex;
    align-items: center;
    margin-bottom: 6px;

    .flag-icon {
      width: 22px;
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
    margin: 6px 0;
    border: 0;
    border-top: 1px solid #e5e7eb;
  }

  .tooltip-metrics {
    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;

      .metric-label {
        font-size: 12px;
        color: #6b7280;
      }

      .metric-value {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
      }
    }
    .metric-row:last-child {
      margin-bottom: 0;
    }
  }
}
