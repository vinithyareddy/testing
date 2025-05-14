this.ResponseFlagMissing = true;

// Only draw the chart if adjustedHours is valid
if (this.adjustedHours > 0 && this.missingHours >= 0) {
  this.renderCompliancePieChart();
}
