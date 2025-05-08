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
