// Restore multiselect dropdown selections
if (element2.title === 'Requesting VPU Group') {
  const match = this.costObjReqItemList.find(x => x.itemName === filterData[1]);
  if (match && !this.cost_obj_req_selectedItems.some(i => i.itemName === match.itemName)) {
    this.cost_obj_req_selectedItems.push(match);
  }
}

if (element2.title === 'Responsible VPU Group') {
  const match = this.costObjResItemList.find(x => x.itemName === filterData[1]);
  if (match && !this.cost_obj_res_selectedItems.some(i => i.itemName === match.itemName)) {
    this.cost_obj_res_selectedItems.push(match);
  }
}

if (element2.title === 'WPA Requesting VPU Group') {
  const match = this.wpaReqItemList.find(x => x.itemName === filterData[1]);
  if (match && !this.wpa_req_selectedItems.some(i => i.itemName === match.itemName)) {
    this.wpa_req_selectedItems.push(match);
  }
}

if (element2.title === 'WPA Responsible VPU Group') {
  const match = this.wpaResItemList.find(x => x.itemName === filterData[1]);
  if (match && !this.wpa_res_selectedItems.some(i => i.itemName === match.itemName)) {
    this.wpa_res_selectedItems.push(match);
  }
}
