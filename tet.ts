LoadChildData(parentData: any) {
  parentData.forEach(resData => {
    // Always recheck checkbox state
    if (resData.data.length === 0) {
      this.spinnerload = true;
      this.BudgetGlance_Service.getFilterChildData(resData).subscribe(datas => {
        resData.data = datas;
        this.markCheckboxSelections(resData);
        this.spinnerload = false;
      });
    } else {
      this.markCheckboxSelections(resData); // ✅ sync state even if data already exists
    }
  });
}
markCheckboxSelections(resData: any): void {
  if (!resData || !resData.data || !Array.isArray(resData.data)) return;

  resData.data.forEach(element => {
    element.checked = false;
    if (this.BudgetGlance_Service.facetFilter.length > 0) {
      this.BudgetGlance_Service.facetFilter.forEach(element2 => {
        if (resData.title === element2.category &&
            element[resData.measureQuery.code] === element2.value) {
          element.checked = true;
        }
      });
    }
  });
}
