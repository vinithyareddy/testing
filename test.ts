let missingOpen = 0;
let missingClosing = 0;
let adjustedOpen = 0;
let adjustedClosing = 0;

this.details.forEach(x => {
  if (x['RM Data[TRS Month Flag]'] === 'Open Months') {
    missingOpen = x['[Missing Time, Hours]'] || 0;
    adjustedOpen = x['[Adjusted Required, Hours]'] || 0;
  }
  if (x['RM Data[TRS Month Flag]'] === 'Closing Months') {
    missingClosing = x['[Missing Time, Hours]'] || 0;
    adjustedClosing = x['[Adjusted Required, Hours]'] || 0;
  }
});

// Total missing and required hours for Open + Closing
this.complianceMissingTime = this.budget_Service.decimalpointconversion(missingOpen + missingClosing, this.unitdecimalpoint);
this.complianceAdjustedRequired = this.budget_Service.decimalpointconversion(adjustedOpen + adjustedClosing, this.unitdecimalpoint);

// Percentage calculation + chart rendering
if (this.complianceAdjustedRequired > 0) {
  this.complianceRatePercentage = Math.round((this.complianceMissingTime / this.complianceAdjustedRequired) * 100);
  this.renderComplianceRateChart();
}
