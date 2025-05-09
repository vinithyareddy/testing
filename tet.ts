forceDropdownSync() {
  this.selectedItemsvpugroup = this.selectedItemsvpugroup?.slice();
  this.cost_obj_req_selectedItems = this.cost_obj_req_selectedItems?.slice();
  this.cost_obj_res_selectedItems = this.cost_obj_res_selectedItems?.slice();
  this.wpa_req_selectedItems = this.wpa_req_selectedItems?.slice();
  this.wpa_res_selectedItems = this.wpa_res_selectedItems?.slice();

  setTimeout(() => {
    this.cdRef.detectChanges();
  }, 100);
}
ngAfterViewInit(): void {
  setTimeout(() => {
    this.forceDropdownSync();
  }, 300);
}

setTimeout(() => {
  this.forceDropdownSync(); // ← Fixes UI issue
}, 200);

setTimeout(() => {
  this.forceDropdownSync();
  this.BudgetGlance_Service.getChangeFilterEmitter('filterApply');
}, 2);
