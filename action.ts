private syncCheckedStateForDropdown(list: any[], categoryName: string): void {
  const activeFilters = this.FilterData.filter(f => f.category === categoryName);

  let selectedItemsTemp = [];

  list.forEach(item => {
    const match = activeFilters.find(f => f.name === item.itemName || f.value === item.itemName);
    if (match) {
      console.log(`✅ Syncing ${categoryName} — pushing`, item.itemName);
      selectedItemsTemp.push(item); // use exact object reference
    }
  });

  console.log(`🟡 ${categoryName} selectedItems BEFORE`, selectedItemsTemp);

  // 🔄 Replace the target array by category
  switch (categoryName) {
    case 'Requesting VPU Group':
      this.cost_obj_req_selectedItems = [...selectedItemsTemp];
      break;
    case 'Responsible VPU Group':
      this.cost_obj_res_selectedItems = [...selectedItemsTemp];
      break;
    case 'WPA Requesting VPU Group':
      this.wpa_req_selectedItems = [...selectedItemsTemp];
      break;
    case 'WPA Responsible VPU Group':
      this.wpa_res_selectedItems = [...selectedItemsTemp];
      break;
  }

  console.log(`🟢 ${categoryName} selectedItems AFTER`, selectedItemsTemp);
}


private syncAllDropdownStates(): void {
  setTimeout(() => {
    this.syncCheckedStateForDropdown(this.costObjReqItemList, 'Requesting VPU Group');
    this.syncCheckedStateForDropdown(this.costObjResItemList, 'Responsible VPU Group');
    this.syncCheckedStateForDropdown(this.wpaReqItemList, 'WPA Requesting VPU Group');
    this.syncCheckedStateForDropdown(this.wpaResItemList, 'WPA Responsible VPU Group');

    this.cdRef.detectChanges(); // 👈 force UI update
    console.log('🔁 Finished syncAllDropdownStates');
  }, 0); // 👈 ensures sync happens after DOM renders
}


setTimeout(() => {
  if (this.costObjReqItemList.length > 0) {
    this.cost_obj_req_selectedItems = [this.costObjReqItemList[0]];
    console.log('🧪 Default test selection added manually');
  }
}, 2000);
