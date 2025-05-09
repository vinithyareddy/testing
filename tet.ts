source.subscribe(Resdatas => {
  // ✅ 1. Clear old selections
  this.cost_obj_req_selectedItems = [];
  this.cost_obj_res_selectedItems = [];
  this.wpa_req_selectedItems = [];
  this.wpa_res_selectedItems = [];
  this.selectedItemsvpugroup = [];

  this.getFilterData(datas, FilterResData, Resdatas, val);

  // ✅ 2. Delay update for dropdown UI to render cleanly
  setTimeout(() => {
    // ✅ 3. Properly assign fresh selection arrays
    this.cost_obj_req_selectedItems = this.costObjReqItemList
      .filter(item => this.FilterData.some(f => f.category === 'Requesting VPU Group' && f.value === item.itemName))
      .slice();

    this.cost_obj_res_selectedItems = this.costObjResItemList
      .filter(item => this.FilterData.some(f => f.category === 'Responsible VPU Group' && f.value === item.itemName))
      .slice();

    this.wpa_req_selectedItems = this.wpaReqItemList
      .filter(item => this.FilterData.some(f => f.category === 'WPA Requesting VPU Group' && f.value === item.itemName))
      .slice();

    this.wpa_res_selectedItems = this.wpaResItemList
      .filter(item => this.FilterData.some(f => f.category === 'WPA Responsible VPU Group' && f.value === item.itemName))
      .slice();

    this.selectedItemsvpugroup = this.vpuItemList
      .filter(item => this.FilterData.some(f => f.category === 'VPU Group' && f.value === item.itemName))
      .slice();

    // ✅ 4. Trigger UI update manually
    this.cdRef.detectChanges();

    // ✅ 5. Emit event after sync
    this.BudgetGlance_Service.getChangeFilterEmitter('filterApply');
  }, 200); // slight delay ensures rendering
});
