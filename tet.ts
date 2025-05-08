setTimeout(() => {
  BudgetrefinerOperation.applyvpufilter(this.AllconstReqData, this.cost_obj_req_selectedItems, this.filterjsonData, this.FilterData, this.wpavpugroupData);
  BudgetrefinerOperation.applyvpufilter(this.AllconstResData, this.cost_obj_res_selectedItems, this.filterjsonData, this.FilterData, this.wpavpugroupData);
  BudgetrefinerOperation.applyvpufilter(this.Allwpareqdata, this.wpa_req_selectedItems, this.filterjsonData, this.FilterData, this.wpavpugroupData);
  BudgetrefinerOperation.applyvpufilter(this.Allwparesdata, this.wpa_res_selectedItems, this.filterjsonData, this.FilterData, this.wpavpugroupData);
}, 300);
