// ✅ Force UI to refresh selected items visually
setTimeout(() => {
  this.cost_obj_req_selectedItems = [...this.cost_obj_req_selectedItems];
  this.cost_obj_res_selectedItems = [...this.cost_obj_res_selectedItems];
  this.wpa_req_selectedItems = [...this.wpa_req_selectedItems];
  this.wpa_res_selectedItems = [...this.wpa_res_selectedItems];
  this.selectedItemsvpugroup = [...this.selectedItemsvpugroup];
}, 0);
