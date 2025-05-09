private syncCheckedStateForDropdown(list: any[], categoryName: string): void {
  const activeFilters = this.FilterData.filter(f => f.category === categoryName);

  // Reset the selected list
  let targetArray = [];

  switch (categoryName) {
    case 'Requesting VPU Group':
      this.cost_obj_req_selectedItems = [];
      targetArray = this.cost_obj_req_selectedItems;
      break;
    case 'Responsible VPU Group':
      this.cost_obj_res_selectedItems = [];
      targetArray = this.cost_obj_res_selectedItems;
      break;
    case 'WPA Requesting VPU Group':
      this.wpa_req_selectedItems = [];
      targetArray = this.wpa_req_selectedItems;
      break;
    case 'WPA Responsible VPU Group':
      this.wpa_res_selectedItems = [];
      targetArray = this.wpa_res_selectedItems;
      break;
  }

  list.forEach(item => {
    const match = activeFilters.find(f => f.name === item.itemName || f.value === item.itemName);
    if (match) {
      targetArray.push(item); // 🔥 Push exact item object from dropdown list
    }
  });
}


if (this.FilterData.length > 0) {
  setTimeout(() => {
    this.syncAllDropdownStates();
    this.cdRef.detectChanges();
  }, 0);
}
