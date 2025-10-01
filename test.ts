const IndexVPU = this.FilterData.findIndex(x => 
  x.category === 'Cost Obj Responsible VPU' || 
  x.category === 'Cost Obj Requesting VPU'
);

const IndexDeptGroup = this.FilterData.findIndex(x => 
  x.category === 'Cost Obj Responsible Department Group' || 
  x.category === 'Cost Obj Requesting Department Group'
);

const IndexDept = this.FilterData.findIndex(x => 
  x.category === 'Cost Obj Responsible Department' || 
  x.category === 'Cost Obj Requesting Department'
);

const IndexDivision = this.FilterData.findIndex(x => 
  x.category === 'Cost Obj Responsible Division' || 
  x.category === 'Cost Obj Requesting Division'
);

const IndexUnit = this.FilterData.findIndex(x => 
  x.category === 'Cost Obj Responsible Unit' || 
  x.category === 'Cost Obj Requesting Unit'
);

if (IndexVPU > -1) {
  this.chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Group Acronym]';
  this.queryID = 'budgetglancewid053b';
  this.tablecolumn = 'Dept Grp';
} else if (IndexDeptGroup > -1) {
  this.chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Acronym]';
  this.queryID = 'budgetglancewid053';
  this.tablecolumn = 'Dept';
} else if (IndexDept > -1) {
  this.chartmeasure = 'Cost Object[Cost Object Responsible Funds Center Acronym]';
  this.queryID = 'budgetglancewid053a';
  this.tablecolumn = 'Unit';
} else if (IndexDivision > -1) {
  this.chartmeasure = 'Cost Object[Cost Object Responsible Funds Center Acronym]';
  this.queryID = 'budgetglancewid053a';
  this.tablecolumn = 'Unit';
} else {
  this.chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Acronym]';
  this.queryID = 'budgetglancewid053';
  this.tablecolumn = 'Dept';
}