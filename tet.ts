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


i see the exact issue now, the first picture shows number of filters, then it shows 13 filters ucrrently are there by default

second picture - selected few options from filters-requesting VPU group. then count came to 16

third picture - when i opened filters again, filter are there as 16 still shows but the boxes are unchecked 

and this is happening for few filters like as in first picture, ofr budget class and business proceesess filters, it is working fine. for posting period, requesting vpu group, and responsible vpu group this issue is there, others i did not check yet 