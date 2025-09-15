<div class="metrics">
  <div class="metric-labels">
    <span>Unique Skills</span>
    <span>Skill Supply (FTE)</span>
  </div>
  <div class="metric-values">
    <span>{{ c.uniqueSkills }}</span>
    <span>{{ c.skillSupply }}</span>
  </div>
</div>

.metrics {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: #374151;

  .metric-labels,
  .metric-values {
    display: flex;
    justify-content: space-between;
    gap: 20px;   // spacing between columns
  }

  .metric-labels {
    font-size: 12px;
    color: #6b7280;   // lighter gray for labels
    font-weight: 500;
  }

  .metric-values {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }
}
