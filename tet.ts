restoreSelectedMultiselectItems() {
  this.cost_obj_req_selectedItems = [];
  this.cost_obj_res_selectedItems = [];
  this.wpa_req_selectedItems = [];
  this.wpa_res_selectedItems = [];

  const filterList = this.BudgetGlance_Service.facetFilter;

  filterList.forEach(filter => {
    switch (filter.category) {
      case 'Requesting VPU Group':
        const foundReq = this.costObjReqItemList.find(x => x.itemName === filter.value);
        if (foundReq) this.cost_obj_req_selectedItems.push(foundReq);
        break;
      case 'Responsible VPU Group':
        const foundRes = this.costObjResItemList.find(x => x.itemName === filter.value);
        if (foundRes) this.cost_obj_res_selectedItems.push(foundRes);
        break;
      case 'WPA Requesting VPU Group':
        const foundWpaReq = this.wpaReqItemList.find(x => x.itemName === filter.value);
        if (foundWpaReq) this.wpa_req_selectedItems.push(foundWpaReq);
        break;
      case 'WPA Responsible VPU Group':
        const foundWpaRes = this.wpaResItemList.find(x => x.itemName === filter.value);
        if (foundWpaRes) this.wpa_res_selectedItems.push(foundWpaRes);
        break;
    }
  });
}
