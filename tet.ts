markCheckboxSelections(resData: any): void {
  if (!resData || !resData.data || !Array.isArray(resData.data)) return;

  console.log('➡️ Checking filter category:', resData.title);

  resData.data.forEach(element => {
    const elementCode = element[resData.measureQuery.code];

    let matched = false;

    this.BudgetGlance_Service.facetFilter.forEach(element2 => {
      console.log('  Comparing:', {
        UI_Category: resData.title,
        UI_Code: elementCode,
        Filter_Category: element2.category,
        Filter_Value: element2.value
      });

      if (
        resData.title?.trim().toLowerCase() === element2.category?.trim().toLowerCase() &&
        elementCode?.toString().trim().toLowerCase() === element2.value?.toString().trim().toLowerCase()
      ) {
        matched = true;
      }
    });

    element.checked = matched;

    if (matched) {
      console.log('✅ Marked as checked:', elementCode);
    }
  });

  this.cdRef.detectChanges();
}
