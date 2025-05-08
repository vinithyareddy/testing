const facetFilters = this.BudgetGlance_Service.facetFilter;

// Restore Requesting VPU Group
const requestingVPU = facetFilters.filter(f => f.category === 'Requesting VPU Group');
this.cost_obj_req_selectedItems = this.costObjReqItemList.filter(item => requestingVPU.some(f => f.value === item.itemName));

// Restore Responsible VPU Group
const responsibleVPU = facetFilters.filter(f => f.category === 'Responsible VPU Group');
this.cost_obj_res_selectedItems = this.costObjResItemList.filter(item => responsibleVPU.some(f => f.value === item.itemName));

// Restore WPA Requesting VPU Group
const wpaRequestingVPU = facetFilters.filter(f => f.category === 'WPA Requesting VPU Group');
this.wpa_req_selectedItems = this.wpaReqItemList.filter(item => wpaRequestingVPU.some(f => f.value === item.itemName));

// Restore WPA Responsible VPU Group
const wpaResponsibleVPU = facetFilters.filter(f => f.category === 'WPA Responsible VPU Group');
this.wpa_res_selectedItems = this.wpaResItemList.filter(item => wpaResponsibleVPU.some(f => f.value === item.itemName));


const vpFilters = this.BudgetGlance_Service.facetFilter.filter(f => f.category === 'VPU Group');
this.selectedItemsvpugroup = this.vpuItemList.filter(item => vpFilters.some(f => f.value === item.itemName));
