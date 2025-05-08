// 🔁 Restore multiselect selections from facetFilter
this.selectedItemsvpugroup = this.vpuItemList.filter(item =>
  this.FilterData.some(filter => filter.category === 'VPU Group' && filter.value === item.itemName)
);

this.cost_obj_req_selectedItems = this.costObjReqItemList.filter(item =>
  this.FilterData.some(filter => filter.category === 'Requesting VPU Group' && filter.value === item.itemName)
);

this.cost_obj_res_selectedItems = this.costObjResItemList.filter(item =>
  this.FilterData.some(filter => filter.category === 'Responsible VPU Group' && filter.value === item.itemName)
);

this.wpa_req_selectedItems = this.wpaReqItemList.filter(item =>
  this.FilterData.some(filter => filter.category === 'WPA Requesting VPU Group' && filter.value === item.itemName)
);

this.wpa_res_selectedItems = this.wpaResItemList.filter(item =>
  this.FilterData.some(filter => filter.category === 'WPA Responsible VPU Group' && filter.value === item.itemName)
);
