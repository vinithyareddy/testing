private syncCheckedStateForDropdown(list: any[], categoryName: string): void {
  const activeFilters = this.FilterData.filter(f => f.category === categoryName);

  list.forEach(item => {
    const match = activeFilters.find(f => f.name === item.itemName || f.value === item.itemName);
    if (match) {
      item.checked = true;

      switch (categoryName) {
        case 'Requesting VPU Group':
          if (!this.cost_obj_req_selectedItems.some(i => i.itemName === item.itemName)) {
            this.cost_obj_req_selectedItems.push(item);
          }
          break;

        case 'Responsible VPU Group':
          if (!this.cost_obj_res_selectedItems.some(i => i.itemName === item.itemName)) {
            this.cost_obj_res_selectedItems.push(item);
          }
          break;

        case 'WPA Requesting VPU Group':
          if (!this.wpa_req_selectedItems.some(i => i.itemName === item.itemName)) {
            this.wpa_req_selectedItems.push(item);
          }
          break;

        case 'WPA Responsible VPU Group':
          if (!this.wpa_res_selectedItems.some(i => i.itemName === item.itemName)) {
            this.wpa_res_selectedItems.push(item);
          }
          break;
      }
    }
  });
}
