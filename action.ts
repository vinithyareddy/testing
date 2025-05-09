private syncCheckedStateForDropdown(list: any[], categoryName: string): void {
  const activeFilters = this.FilterData.filter(f => f.category === categoryName);
  list.forEach(item => {
    const match = activeFilters.find(f => f.name === item.itemName || f.value === item.itemName);
    if (match) {
      item.checked = true;
    }
  });
}


if (this.FilterData.length > 0) {
  this.syncCheckedStateForDropdown(this.costObjReqItemList, 'Requesting VPU Group');
  this.syncCheckedStateForDropdown(this.costObjResItemList, 'Responsible VPU Group');
  this.syncCheckedStateForDropdown(this.wpaReqItemList, 'WPA Requesting VPU Group');
  this.syncCheckedStateForDropdown(this.wpaResItemList, 'WPA Responsible VPU Group');
}
