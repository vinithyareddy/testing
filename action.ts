private syncCheckedStateForDropdown(list: any[], categoryName: string): void {
  const activeFilters = this.FilterData.filter(f => f.category === categoryName);
  const selected = [];

  list.forEach(item => {
    const match = activeFilters.find(f => f.name === item.itemName || f.value === item.itemName);
    if (match) {
      selected.push(item); // must be exact reference
    }
  });

  switch (categoryName) {
    case 'Requesting VPU Group':
      this.cost_obj_req_selectedItems = [...selected];
      break;
    case 'Responsible VPU Group':
      this.cost_obj_res_selectedItems = [...selected];
      break;
    case 'WPA Requesting VPU Group':
      this.wpa_req_selectedItems = [...selected];
      break;
    case 'WPA Responsible VPU Group':
      this.wpa_res_selectedItems = [...selected];
      break;
  }
}


if (this.FilterData.length > 0) {
  setTimeout(() => {
    this.syncAllDropdownStates();
    this.cdRef.detectChanges();
  }, 0);
}
