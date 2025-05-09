// Restore Requesting VPU Group
const matchedCostObjReq = this.costObjReqItemList.filter(item =>
  requestingVPU.some(f => f.value === item.itemName)
);
this.cost_obj_req_selectedItems = [...matchedCostObjReq];

// Restore Responsible VPU Group
const matchedCostObjRes = this.costObjResItemList.filter(item =>
  responsibleVPU.some(f => f.value === item.itemName)
);
this.cost_obj_res_selectedItems = [...matchedCostObjRes];

// Restore WPA Requesting VPU Group
const matchedWpaReq = this.wpaReqItemList.filter(item =>
  wpaRequestingVPU.some(f => f.value === item.itemName)
);
this.wpa_req_selectedItems = [...matchedWpaReq];

// Restore WPA Responsible VPU Group
const matchedWpaRes = this.wpaResItemList.filter(item =>
  wpaResponsibleVPU.some(f => f.value === item.itemName)
);
this.wpa_res_selectedItems = [...matchedWpaRes];

// 🔁 Force change detection
this.cdRef.detectChanges();
